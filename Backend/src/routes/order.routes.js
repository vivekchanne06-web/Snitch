import {Router} from 'express';
import {createCODOrder,createRazorpayOrder,verifyRazorpayPayment,getUserOrders} from '../controller/order.controller.js';
import { aunthicateUser } from '../middleware/auth.middleware.js';

const orderRouter = Router();

orderRouter.post("/cod", aunthicateUser, createCODOrder);
orderRouter.post("/razorpay", aunthicateUser, createRazorpayOrder);
orderRouter.post("/razorpay/verify", aunthicateUser, verifyRazorpayPayment);

orderRouter.get("/", aunthicateUser, getUserOrders);

export default orderRouter;