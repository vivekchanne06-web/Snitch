import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const addProduct = async (req, res) => {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(
        req.files.map(async (file) => {
        return await uploadImage({
            buffer: file.buffer,
            fileName: file.originalname,
            folder: "Snitch"
        });

    }));

    console.log(images);
    
    const product = new productModel({
        title,
        description,
        price: { amount: priceAmount,
        currency: priceCurrency || "INR"
    },
        images,
        seller: seller._id
    });

    await product.save();

    res.status(201).json({
        message: "Product added successfully",
        success: true,
        product
    });
};