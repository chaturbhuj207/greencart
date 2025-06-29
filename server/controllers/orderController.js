import e from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Stripe from "stripe";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, addressId } = req.body;
        const userId = req.userId;

        if (!items?.length || !addressId) {
            return res.json({ success: false, message: "Cart is empty or address is not selected" });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02);

        await Order.create({ userId, items, addressId, amount, paymentType: "COD" });

        res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Orders by user ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId, $or: [{ paymentType: "COD" }, { isPaid: true }] }).populate("items.product addressId").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ $or: [{ paymentType: "COD" }, { isPaid: true }] }).populate("items.product addressId").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { items, addressId } = req.body
        const userId = req.userId

        const { origin } = req.headers;

        if (items.length === 0 || !addressId) {
            return res.json({ success: false, message: "Cart is empty or address is not selected" });
        }

        let productData = [];

        // Calculate total amount
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity
        }, 0);
        // add tax charge 2%
        amount += Math.floor(amount * 0.2);

        const order = await Order.create({
            userId,
            items,
            addressId,
            amount,
            paymentType: "online",
        });

        // Stripe Payment Gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe

        const lineItems = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },
                quantity: item.quantity,
            };
        });

        // create stripe session
        const session = await stripeInstance.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        res.json({ success: true, message: "Order placed successfully", url: session.url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Stripe Webhooks to verify payment Action : /stripe
export const stripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { orderId, userId } = session.metadata;
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        await User.findByIdAndUpdate(userId, { cartItems: {} });
        console.log("✅ Order marked paid, cart cleared");
    }

    return res.json({ received: true });
};
  