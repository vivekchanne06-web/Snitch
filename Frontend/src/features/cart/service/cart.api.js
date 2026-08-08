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