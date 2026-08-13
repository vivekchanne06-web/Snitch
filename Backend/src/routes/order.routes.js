import {Router} from 'express';
import {createCODOrder} from '../controller/order.controller.js';
import { aunthicateUser } from '../middleware/auth.middleware.js';

const orderRouter = Router();

orderRouter.post("/cod", aunthicateUser, createCODOrder);

export default orderRouter;