import { createRazorpayOrder, createCODOrder, verifyRazorPayOrder, getMyOrders } from "../service/order.api.js";


export const useOrder = () => {

    async function handleCreateCODOrder(addressId) {
        try {
            const data = await createCODOrder(addressId);
            return data;
        } catch (error) {
            console.error(
                error.response?.data?.message || error.message
            );
            throw error;
        }
    }


    async function handleCreateRazorpayOrder(addressId) {
        try {
            const data = await createRazorpayOrder(addressId);
            return data;
        } catch (error) {
            console.error(
                error.response?.data?.message || error.message
            );
            throw error;
        }
    }


    async function handleVerifyRazorpayPayment(paymentData) {
        try {
            const data = await verifyRazorPayOrder(paymentData);
            return data;
        } catch (error) {
            console.error(
                error.response?.data?.message || error.message
            );
            throw error;
        }
    }

    async function handleGetMyOrders() {
        try {
            const data = await getMyOrders();
            return data;
        } catch (error) {
            console.error(
                error.response?.data?.message || error.message
            );
            throw error;
        }
    }

    return {
        handleCreateCODOrder,
        handleCreateRazorpayOrder,
        handleVerifyRazorpayPayment,
        handleGetMyOrders,
    };
};