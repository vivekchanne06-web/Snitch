import axios from "axios";


const addressApi = axios.create({
    baseURL: "/api/address",
    withCredentials: true
})

export const createUserAddress = async(addressData) => {
    const response = await addressApi.post("/create",addressData);
    return response.data
}

export const getUserAddress = async() => {
    const response = await addressApi.get("/get")
    return response.data
}

export const deleteUserAddress = async(addressId) => {
    const response = await addressApi.delete(`/delete/${addressId}`)
    return response.data
}

export const updateUserAddress = async(addressId,addressData) => {
    const response = await addressApi.put(`/update/${addressId}`,addressData)
    return response.data
}

