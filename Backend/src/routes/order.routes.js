import {Router} from 'express';
import {createCODOrder,createRazorpayOrder,verifyRazorpayPayment,getUserOrders,createBuyNowCODOrder,createBuyNowRazorpayOrder,verifyBuyNowRazorpayPayment} from '../controller/order.controller.js';
import { aunthicateUser } from '../middleware/auth.middleware.js';

const orderRouter = Router();

orderRouter.post("/cod", aunthicateUser, createCODOrder);
orderRouter.post("/razorpay", aunthicateUser, createRazorpayOrder);
orderRouter.post("/razorpay/verify", aunthicateUser, verifyRazorpayPayment);

orderRouter.get("/", aunthicateUser, getUserOrders);

orderRouter.post("/buy-now/cod", aunthicateUser, createBuyNowCODOrder);
orderRouter.post("/buy-now/razorpay", aunthicateUser, createBuyNowRazorpayOrder);
orderRouter.post("/buy-now/razorpay/verify", aunthicateUser, verifyBuyNowRazorpayPayment);

export default orderRouter;