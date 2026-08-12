import mangoose from 'mongoose';
import cartModel from '../models/cart.model.js';

export async function getCartDetails(userId) {
    let cart = await cartModel.aggregate([
            {
                $match: {
                    user: new mangoose.Types.ObjectId(userId)
                }
            },
            {
                $unwind: "$items"
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