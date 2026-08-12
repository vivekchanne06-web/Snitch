import axios from "axios";


const cartApi = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItemInCart = async ({productId, variantId}) => {
    const response = await cartApi.post(`/add/${productId}/${variantId}`,{
        quantity: 1
    });
    return response.data
}

export const getCartDetails = async () => {
    const response = await cartApi.get("/");
    return response.data
}

export const incrementQuantityInCart = async({productId, variantId})=>{

    const response = await cartApi.patch(`/quantity/increase/${productId}/${variantId}`);
    return response.data

}
export const decrementQuantityInCart = async({productId, variantId})=>{

    const response = await cartApi.patch(`/quantity/decrease/${productId}/${variantId}`);
    return response.data
}

export const removeItemFromCart = async ({ productId, variantId }) => {
    const response = await cartApi.delete(`/remove/${productId}/${variantId}`);
    return response.data
}

export const createPaymentOrder = async() => {
    const response = await cartApi.post('/payment/create/order')
    return response.data
}

export const verifyOrderPayment = async({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
    const response = await cartApi.post('/payment/verify/order',{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    
    return response.data
}
    