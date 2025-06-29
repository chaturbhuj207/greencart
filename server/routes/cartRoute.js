import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";


const cartRoute = express.Router();

cartRoute.post('/update', authUser, updateCart)

export default cartRoute