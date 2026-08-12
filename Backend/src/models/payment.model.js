import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const paymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    price: {
        type: priceSchema,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
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
        
    }]
})

const paymentModel = mongoose.model("Payment", paymentSchema);

export default paymentModel;