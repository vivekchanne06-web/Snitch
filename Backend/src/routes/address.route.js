import {Router} from 'express';
import { aunthicateUser } from '../middleware/auth.middleware.js';
import {createAddress,getAddress} from '../controller/address.controller.js';
import {userAddressValidator } from "../validators/address.validator.js"

const addressRouter = Router();

addressRouter.post("/create", aunthicateUser, userAddressValidator, createAddress);
addressRouter.get("/get", aunthicateUser, getAddress);

export default addressRouter; 