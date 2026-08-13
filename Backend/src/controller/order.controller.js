import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import addressModel from "../models/address.model.js";
import paymentModel from "../models/payment.model.js";
import { getCartDetails } from "../dao/getUserCart.dao.js";

export const createCODOrder = async (req, res) => {
    try {
        const { addressId } = req.body;
        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }
        // 1. Get user's cart from database
        const carts = await getCartDetails(req.user._id);
        const cart = carts?.[0];
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty. Cannot create order."
            });
        }
        // 2. Make sure address belongs to logged-in user
        const address = await addressModel.findOne({
            _id: addressId,
            user: req.user._id
        });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }
        // 3. Read latest product/variant information
        const orderItems = [];
        for (const item of cart.items) {
            const product = await productModel.findOne({
                _id: item.product._id,
                "variants._id": item.variant
            });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product or variant not found"
                });
            }
            const variant = product.variants.id(item.variant);
            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: "Variant not found"
                });
            }
            // 4. Check current stock
            if (variant.stock < item.quantity) {
                return res.status(409).json({
                    success: false,
                    message: `${product.title} does not have enough stock`
                });
            }
            // 5. Create immutable order item snapshot
            orderItems.push({
                title: product.title,
                description: product.description,
                product: product._id,
                variant: variant._id,
                quantity: item.quantity,
                price: {
                    amount: variant.price.amount,
                    currency: variant.price.currency
                },
                images: variant.images,
            });
        }
        // 6. Create Order
        const order = await orderModel.create({

            user: req.user._id,

            orderItems,

            total: {
                amount: cart.total,
                currency: cart.currency || "INR"
            },
            shippingAddress: {
                fullName: address.fullName,
                phoneNumber: address.phoneNumber,
                emailId: address.emailId,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
            },
            paymentMethod: "cod",
            estimatedDeliveryDate: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
        });
        // 7. Create Payment linked to Order
        await paymentModel.create({
            order: order._id,
            user: req.user._id,
            method: "cod",
            status: "pending",
            price: order.total,
        });
        // 8. Reduce stock
        for (const item of cart.items) {
            await productModel.updateOne(
                {
                    _id: item.product._id,
                    "variants._id": item.variant,
                    "variants.stock": { $gte: item.quantity }
                },
                {
                    $inc: {
                        "variants.$.stock": -item.quantity
                    }
                }
            );
        }
        // 9. Clear cart
        await cartModel.updateOne(
            {
                user: req.user._id
            },
            {
                $set: {
                    items: []
                }
            }
        );
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {

        console.error("Create COD order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};