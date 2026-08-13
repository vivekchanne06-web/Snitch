import {Router} from 'express';
import { aunthicateUser } from '../middleware/auth.middleware.js';
import {createAddress,getAddress,updateAddress,deleteAddress} from '../controller/address.controller.js';
import {userAddressValidator,updateAddressValidator } from "../validators/address.validator.js"

const addressRouter = Router();

addressRouter.post("/create", aunthicateUser, userAddressValidator, createAddress);

addressRouter.get("/get", aunthicateUser, getAddress);

addressRouter.put("/update/:addressId", aunthicateUser, updateAddressValidator, updateAddress);

addressRouter.delete("/delete/:addressId", aunthicateUser, deleteAddress);

export default addressRouter; 