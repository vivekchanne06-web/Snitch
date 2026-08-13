import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
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
    method: {
        type: String,
        enum: ["cod", "razorpay"],
        required: true,
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    
    },
    {
        timestamps: true,
    }
)

const paymentModel = mongoose.model("Payment", paymentSchema);

export default paymentModel;