import axios from "axios";
import { image } from "framer-motion/client";

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


export const addVariant = async (ProductId, newProductVarient) => {
    try {
        const formData = new FormData();
        
        newProductVarient.images.forEach((image) => {
            const file = image?.file || image;
            formData.append("images", file);
        });
        
        formData.append("stock", newProductVarient.stock);
        formData.append("priceAmount", newProductVarient.price.amount);
        formData.append("attributes", JSON.stringify(newProductVarient.attributes));

        // Send backend required fields taken from existing product
        if (newProductVarient.title) {
            formData.append("title", newProductVarient.title);
        }
        if (newProductVarient.description) {
            formData.append("description", newProductVarient.description);
        }
        const currency = newProductVarient.priceCurrency || newProductVarient.price?.currency;
        if (currency) {
            formData.append("priceCurrency", currency);
        }

        const response = await productApi.post(`/${ProductId}/variants`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
