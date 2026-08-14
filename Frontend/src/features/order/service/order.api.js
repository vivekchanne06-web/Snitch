import axios from "axios";

const orderApi = axios.create({
    baseURL: "/api/orders",
    withCredentials: true
})

export const createCODOrder = async (addressId) => {
    const response = await orderApi.post("/cod", {
        addressId,
    });
    return response.data;
};

export const createRazorpayOrder = async (addressId) => {
    const response = await orderApi.post("/razorpay", {
        addressId,
    });
    return response.data;
};

export const verifyRazorPayOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await orderApi.post('/razorpay/verify', {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });
    return response.data;
};

export const getMyOrders = async () => {
    const response = await orderApi.get('/');
    return response.data;
};