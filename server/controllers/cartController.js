import User from "../models/User.js"


// Update User cartData : /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { cartItems } = req.body;
        if (!userId || !cartItems) {
            return res.json({ success: false, message: "Missing data" });
        }
        await User.findByIdAndUpdate(userId, { cartItems });
        res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}