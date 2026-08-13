import mongoose from 'mongoose';
import cartModel from '../models/cart.model.js';

export async function getCartDetails(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const existingCart = await cartModel.findOne({ user: userObjectId }).lean();
    if (!existingCart) {
        return [];
    }
    if (!existingCart.items || existingCart.items.length === 0) {
        return [
        {
            _id: existingCart._id,
            user: existingCart.user,
            items: [],
            total: 0
        }
        ];
    }
    let cart = await cartModel.aggregate([
            {
                $match: {
                    user: userObjectId
                }
            },
            {
                $unwind: "$items",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $unwind: "$product.variants"
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$items.variant",
                            "$product.variants._id"
                        ]
                    }
                }
            },
            {
                $set: {
                    "items.product": "$product",
                    "items.itemPrice": {
                        $multiply: [
                            "$items.quantity",
                            "$product.variants.price.amount"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    items: { $push: "$items" },
                    total: { $sum: "$items.itemPrice" }
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    items: 1,
                    total: 1
                }
            }
        ]);
    return cart;
}