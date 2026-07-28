import axios from "axios";

const productApi = axios.create({
    baseURL : "/api/products",
    withCredentials : true, 
});

export const addProduct = async (FormData) => {
    try {
        const response = await productApi.post("/add",FormData);
        return response.data;
    } catch (error) {
        throw error;
    }
}   
export  const getSellerProduct = async() =>{
    try {
        const response = await productApi.get("/seller");
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;    
    }
}

export const getAllProducts = async() =>{
    try {
        const response = await productApi.get("/");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProductDetail = async (ProductId)=>{

    try {
        const response = await productApi.get(`/detail/${ProductId}`);
        return response.data;
    } catch (error) {
        throw error;
    }   
}