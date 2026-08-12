import axios from "axios";


const addressApi = axios.create({
    baseURL: "/api/address",
    withCredentials: true
})

export const createAddress = async(addressData) => {
    const response = await addressApi.post("/create",addressData);
    return response.data
}

export const getUserAddress = async() => {
    const response = await addressApi.get("/get")
    return response.data
}