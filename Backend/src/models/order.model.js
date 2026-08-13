import mongoose from "mongoose";
import priceSchema from "./price.schema.js";


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: priceSchema,
            required: true,
        },
        images: [{ url: String }],

    }],
    total: {
        type: priceSchema,
        required: true,
    },
    shippingAddress: {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        emailId: {
            type: String,
            trim: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    paymentMethod:{
        type: String,
        enum: ["cod", "razorpay"],
        required: true,
    },
    razorpayOrderId:{
        type:String,
        
    },
    razorpayPaymentId: {
        type: String,  
    },
    razorpaySignature: {
        type: String,
        
    },
    estimatedDeliveryDate: {
        type: Date,
    },
    },
    { 
       timestamps: true,
    }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
