import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import addressModel from "../models/address.model.js";
import paymentModel from "../models/payment.model.js";
import { getCartDetails } from "../dao/getUserCart.dao.js";
import { createOrder } from "../services/payment.service.js";
import { config } from "../config/config.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

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

export const createRazorpayOrder = async (req, res) => {
    try {
        const { addressId } = req.body;
        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }
        const carts = await getCartDetails(req.user._id);
        const cart = carts?.[0];
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty. Cannot create order."
            });
        }
        const address = await addressModel.findOne({
            _id: addressId,
            user: req.user._id
        });
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Invalid address"
            });
        }
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

            if (variant.stock < item.quantity) {
                return res.status(409).json({
                    success: false,
                    message: `${product.title} does not have enough stock`
                });
            }
            

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

            paymentMethod: "razorpay",

            estimatedDeliveryDate: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
        });

        const razorpayOrder = await createOrder({
            amount: cart.total,
            currency: cart.currency || "INR"
        });
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        await paymentModel.create({
            order: order._id,
            user: req.user._id,
            method: "razorpay",
            status: "pending",
            price: order.total,

            razorpay: {
                orderId: razorpayOrder.id,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Razorpay order created successfully",
            orderId: order._id,
            keyId: config.RAZORPAY_KEY_ID,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            }
        });
    } catch (error) {
        console.error("Create Razorpay order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            });
        }
        const payment = await paymentModel.findOne({
            "razorpay.orderId": razorpay_order_id,
            status: "pending"
        });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found or already processed"
            });
        }
        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized payment"
            });
        }
        const isValidPayment = validatePaymentVerification(
            {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id
            },
            razorpay_signature,
            config.RAZORPAY_KEY_SECRET
        );

        if (!isValidPayment) {
            payment.status = "failed";
            await payment.save();
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        payment.status = "completed";
        payment.razorpay.paymentId = razorpay_payment_id;
        payment.razorpay.signature = razorpay_signature;

        await payment.save();

        const order = await orderModel.findById(payment.order);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        for (const item of order.orderItems) {
            await productModel.updateOne(
                {
                    _id: item.product,
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

    return res.status(200).json({
            success: true,
            message: "Payment verified and order completed successfully",
            order
        });
    } catch (error) {
        console.error("Verify Razorpay payment error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createBuyNowCODOrder = async (req, res) => {
    try {
        const { productId, variantId, quantity = 1, addressId } = req.body;
        if (!addressId || !productId || !variantId) {
            return res.status(400).json({
                success: false,
                message: "Product, variant, and address are required"
            });
        }
        const qty = Number(quantity) > 0 ? Number(quantity) : 1;

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

        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product or variant not found"
            });
        }
        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found"
            });
        }

        if (variant.stock < qty) {
            return res.status(409).json({
                success: false,
                message: `${product.title} does not have enough stock`
            });
        }

        const orderItems = [{
            title: product.title,
            description: product.description,
            product: product._id,
            variant: variant._id,
            quantity: qty,
            price: {
                amount: variant.price.amount,
                currency: variant.price.currency
            },
            images: variant.images,
        }];

        const totalAmount = variant.price.amount * qty;

        const order = await orderModel.create({
            user: req.user._id,
            orderItems,
            total: {
                amount: totalAmount,
                currency: variant.price.currency || "INR"
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

        await paymentModel.create({
            order: order._id,
            user: req.user._id,
            method: "cod",
            status: "pending",
            price: order.total,
        });

        await productModel.updateOne(
            {
                _id: product._id,
                "variants._id": variant._id,
                "variants.stock": { $gte: qty }
            },
            {
                $inc: {
                    "variants.$.stock": -qty
                }
            }
        );

        return res.status(201).json({
            success: true,
            message: "Buy Now order placed successfully",
            order
        });
    } catch (error) {
        console.error("Create Buy Now COD order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createBuyNowRazorpayOrder = async (req, res) => {
    try {
        const { productId, variantId, quantity = 1, addressId } = req.body;
        if (!addressId || !productId || !variantId) {
            return res.status(400).json({
                success: false,
                message: "Product, variant, and address are required"
            });
        }
        const qty = Number(quantity) > 0 ? Number(quantity) : 1;

        const address = await addressModel.findOne({
            _id: addressId,
            user: req.user._id
        });
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Invalid address"
            });
        }

        const product = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product or variant not found"
            });
        }
        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found"
            });
        }

        if (variant.stock < qty) {
            return res.status(409).json({
                success: false,
                message: `${product.title} does not have enough stock`
            });
        }

        const totalAmount = variant.price.amount * qty;

        const orderItems = [{
            title: product.title,
            description: product.description,
            product: product._id,
            variant: variant._id,
            quantity: qty,
            price: {
                amount: variant.price.amount,
                currency: variant.price.currency
            },
            images: variant.images,
        }];

        const order = await orderModel.create({
            user: req.user._id,
            orderItems,
            total: {
                amount: totalAmount,
                currency: variant.price.currency || "INR"
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
            paymentMethod: "razorpay",
            estimatedDeliveryDate: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
        });

        const razorpayOrder = await createOrder({
            amount: totalAmount,
            currency: variant.price.currency || "INR"
        });
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        await paymentModel.create({
            order: order._id,
            user: req.user._id,
            method: "razorpay",
            status: "pending",
            price: order.total,
            razorpay: {
                orderId: razorpayOrder.id,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Razorpay Buy Now order created successfully",
            orderId: order._id,
            keyId: config.RAZORPAY_KEY_ID,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            }
        });
    } catch (error) {
        console.error("Create Razorpay Buy Now order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyBuyNowRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            });
        }
        const payment = await paymentModel.findOne({
            "razorpay.orderId": razorpay_order_id,
            status: "pending"
        });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found or already processed"
            });
        }
        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized payment"
            });
        }
        const isValidPayment = validatePaymentVerification(
            {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id
            },
            razorpay_signature,
            config.RAZORPAY_KEY_SECRET
        );

        if (!isValidPayment) {
            payment.status = "failed";
            await payment.save();
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        payment.status = "completed";
        payment.razorpay.paymentId = razorpay_payment_id;
        payment.razorpay.signature = razorpay_signature;

        await payment.save();

        const order = await orderModel.findById(payment.order);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        for (const item of order.orderItems) {
            await productModel.updateOne(
                {
                    _id: item.product,
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

        return res.status(200).json({
            success: true,
            message: "Payment verified and order completed successfully",
            order
        });
    } catch (error) {
        console.error("Verify Buy Now Razorpay payment error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
