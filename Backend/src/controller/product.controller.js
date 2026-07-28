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
        price: {
            amount: priceAmount,
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

export const getProduct = async (req, res) => {

    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    }); 


}

export const getAllProducts = async (req, res) => {

    const products = await productModel.find();

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    });
}

export const getProductDetail = async (req, res) => {

    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        });
    }

    res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        product
    });

}

export const addVariant = async (req, res) => {

    const productId = req.params.productId;
    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id 
    });

    if(!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        });
    }

    const files = req.files;

    let images=[]

    if (files && files.length > 0) {
    images = await Promise.all(
        files.map(async (file) => {
            return await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname,
                folder: "Snitch",
            });
        })
    );
}

    const price = Number(req.body.priceAmount)
    const stock = Number(req.body.stock)
    const attributes = JSON.parse(req.body.attributes || '{}');


    product.variants.push({
        images,
        price: {
            amount: price || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency 
        },
        stock: stock,
        attributes
    });
    await product.save();

    res.status(201).json({
        message: "Variant added successfully",
        success: true,
        product
    });
    
}