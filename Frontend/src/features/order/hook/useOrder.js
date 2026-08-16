import {
    createRazorpayOrder,
    createCODOrder,
    verifyRazorPayOrder,
    getMyOrders,
    createBuyNowCODOrder,
    createBuyNowRazorpayOrder,
    verifyBuyNowRazorpayPayment,
} from "../service/order.api.js";

export const useOrder = () => {
    async function handleCreateCODOrder(addressId) {
        try {
            const data = await createCODOrder(addressId);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleCreateRazorpayOrder(addressId) {
        try {
            const data = await createRazorpayOrder(addressId);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleVerifyRazorpayPayment(paymentData) {
        try {
            const data = await verifyRazorPayOrder(paymentData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleGetMyOrders() {
        try {
            const data = await getMyOrders();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleCreateBuyNowCODOrder(payload) {
        try {
            const data = await createBuyNowCODOrder(payload);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleCreateBuyNowRazorpayOrder(payload) {
        try {
            const data = await createBuyNowRazorpayOrder(payload);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleVerifyBuyNowRazorpayPayment(paymentData) {
        try {
            const data = await verifyBuyNowRazorpayPayment(paymentData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    return {
        handleCreateCODOrder,
        handleCreateRazorpayOrder,
        handleVerifyRazorpayPayment,
        handleGetMyOrders,
        handleCreateBuyNowCODOrder,
        handleCreateRazorpayOrderBuyNow: handleCreateBuyNowRazorpayOrder,
        handleCreateBuyNowRazorpayOrder,
        handleVerifyBuyNowRazorpayPayment,
    };
};