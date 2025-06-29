import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRoute from './routes/orderRoute.js';
import { stripeWebhook } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Allowed Origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://greencart-bice-nu.vercel.app'
];

// ✅ Stripe Webhook Route should come BEFORE express.json() middleware
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
// OR test dummy handler if needed
// app.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
//     console.log("🛑 Stripe webhook called");
//     res.json({ received: true });
// });

// ✅ Middlewares (after webhook route)
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ✅ Routes
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRoute);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRoute);

// ✅ Start Server
app.listen(port, () => {
    console.log(`✅ Server is running on port http://localhost:${port}`);
});
