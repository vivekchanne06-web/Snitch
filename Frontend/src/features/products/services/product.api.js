import axios from "axios";
import { image } from "framer-motion/client";

const productApi = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
});

export const addProduct = async (FormData) => {
    try {
        const response = await productApi.post("/add", FormData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getSellerProduct = async () => {
    try {
        const response = await productApi.get("/seller");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllProducts = async () => {
    try {
        const response = await productApi.get("");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProductDetail = async (ProductId) => {

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
        if (newProductVarient.price?.amount) {
            formData.append("priceAmount", newProductVarient.price.amount);
        } else if (newProductVarient.priceAmount) {
            formData.append("priceAmount", newProductVarient.priceAmount);
        }

        formData.append("attributes", JSON.stringify(newProductVarient.attributes));

        // Automatically include the existing parent product information to satisfy backend requirements
        if (newProductVarient.title) formData.append("title", newProductVarient.title);
        if (newProductVarient.description) formData.append("description", newProductVarient.description);
        if (newProductVarient.category) {
            // Handle category object or string
            formData.append("category", typeof newProductVarient.category === 'object' ? newProductVarient.category._id || newProductVarient.category : newProductVarient.category);
        }
        if (newProductVarient.brand) {
            // Handle brand object or string
            formData.append("brand", typeof newProductVarient.brand === 'object' ? newProductVarient.brand._id || newProductVarient.brand : newProductVarient.brand);
        }
        if (newProductVarient.seller) {
            formData.append("seller", typeof newProductVarient.seller === 'object' ? newProductVarient.seller._id || newProductVarient.seller : newProductVarient.seller);
        }
        if (newProductVarient.priceCurrency) {
            formData.append("priceCurrency", newProductVarient.priceCurrency);
        } else if (newProductVarient.price?.currency) {
            formData.append("priceCurrency", newProductVarient.price.currency);
        }

        const response = await productApi.post(`/${ProductId}/variants`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async (ProductId) => {
    try {
        const response = await productApi.delete(`/${ProductId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateVarient = async (ProductId, VariantId, updateVariant) => {
    try {
        const formData = new FormData()
        if (updateVariant.price?.amount !== undefined) {
            formData.append("priceAmount", updateVariant.price.amount);
        }
        if (updateVariant.price?.currency !== undefined) {
            formData.append("priceCurrency", updateVariant.price.currency);
        }
        if (updateVariant.stock !== undefined) {
            formData.append("stock", updateVariant.stock);
        }
        if (updateVariant.attributes !== undefined) {
            formData.append("attributes", JSON.stringify(updateVariant.attributes));
        }
        if (updateVariant.existingImages !== undefined) {
            formData.append(
                "existingImages",
                JSON.stringify(updateVariant.existingImages)
            );
        }
        if (updateVariant.images) {
            updateVariant.images.forEach((image) => {
                const file = image?.file || image;

                if (file instanceof File) {
                    formData.append("images", file);
                }
            });
        }
        const response = await productApi.patch(
            `/${ProductId}/variants/${VariantId}`,
            formData
        );

        return response.data;


    } catch (error) {
        throw error;
    }
}

export const deleteVariant = async (ProductId, VariantId) => {
    try {
        const response = await productApi.delete(`/${ProductId}/variants/${VariantId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
