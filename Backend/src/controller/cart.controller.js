import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';
import { stockOfVarient } from '../dao/product.dao.js';
import { getCartDetails } from '../dao/getUserCart.dao.js';
import { createOrder } from '../services/payment.service.js';
import paymentModel from '../models/payment.model.js';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';
import { config } from '../config/config.js';


export const addToCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });




    if (!product) {
        return res.status(404)
            .json({
                success: false,
                message: 'Product or variant not found'
            })

    }

    const stock = await stockOfVarient(productId, variantId);

    let cart = (await cartModel.findOne({ user: req.user._id }))
        || await cartModel.create({ user: req.user._id });

    const isItemIncart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId);

    if (isItemIncart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity;
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                success: false,
                message: `only ${stock - quantityInCart} items left in stock and you already have ${quantityInCart} in your cart`
            })
        }

        const updatedCart = await cartModel.findOneAndUpdate(
            {
                user: req.user._id,
                "items.product": productId,
                "items.variant": variantId
            },
            {
                $inc: { "items.$.quantity": quantity }
            },
            {
                new: true
            }
        )
            .populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item quantity updated in cart",
            cart: updatedCart
        });
    }

    if (quantity > stock) {
        return res.status(400).json({
            success: false,
            message: `only ${stock} items left in stock`
        })
    }
    cart.items.push({
        product: productId,
        variant: variantId,
        quantity: quantity,
        price: {
            amount: product.price.amount,
            currency: product.price.currency
        }
    });
    await cart.save();

    await cart.populate("items.product");

    return res.status(200).json({
        success: true,
        message: "Item added to cart",
        cart
    });

}

export const getCart = async (req, res) => {
    try {
        const user = req.user;

        let cart = await getCartDetails(user._id);

        if (!cart.length) {
            const newCart = await cartModel.create({
                user: user._id,
                items: []
            });

            return res.status(200).json({
                success: true,
                message: "Cart retrieved successfully",
                cart: newCart
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart retrieved successfully",
            cart: cart[0]
        });

    } catch (error) {
        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cart",
            error: error.message
        });
    }
};

export const incrementQuantity = async (req, res) => {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });
    if (!product) {
        return res.status(404)
            .json({
                success: false,
                message: 'Product or variant not found'
            })
    }
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        })
    }

    const stock = await stockOfVarient(productId, variantId);

    const itemInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId)?.quantity || 0;


    if (itemInCart + 1 > stock) {
        return res.status(400).json({
            success: false,
            message: `only ${stock - itemInCart} items left in stock and you already have ${itemInCart} in your cart`
        })
    }

    await cartModel.findOneAndUpdate({
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId
    },
        {
            $inc: { "items.$.quantity": 1 }
        },
        {
            new: true
        })

    return res.status(200).json({
        success: true,
        message: "Item quantity increased in cart"
    });
}

export const decrementQuantity = async (req, res) => {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });
    if (!product) {
        return res.status(404)
            .json({
                success: false,
                message: 'Product or variant not found'
            })
    }
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        })
    }

    const itemInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId)?.quantity || 0;

    if (itemInCart <= 1) {
        return res.status(400).json({
            success: false,
            message: `Item quantity cannot be less than 1`
        })
    }

    await cartModel.findOneAndUpdate({
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId
    },
        {
            $inc: { "items.$.quantity": -1 }
        },
        {
            new: true
        })

    return res.status(200).json({
        success: true,
        message: "Item quantity decreased in cart"
    });
}

export const removeFromCart = async (req, res) => {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });
    if (!product) {
        return res.status(404)
            .json({
                success: false,
                message: 'Product or variant not found'
            })
    }

    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        })
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId && item.variant.toString() === variantId);

    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Item not found in cart'
        })
    }

    const updatedCart = await cartModel.findOneAndUpdate({
        user: req.user._id
    },
        {
            $pull: { items: { product: productId, variant: variantId } }
        },
        {
            new: true
        })

    return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: updatedCart
    });
}

export const createOrderController = async (req, res) => {

    const carts = await getCartDetails(req.user._id);
    const cart = carts?.[0];

    if (!cart) {


        return res.status(400).json({
            success: false,
            message: "Cart is empty. Cannot create order."
        });
    }



    const order = await createOrder({ amount: cart.total, currency: cart.currency });

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id
        },
        price: {
            amount: cart.total,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            description: item.product.description,
            product: item.product._id,
            variant: item.variant,
            quantity: item.quantity,
            images: item.product.variants.images ||
                item.product.variants
                    .find(variant => variant._id.toString() === item.variant.toString())
                    ?.images || [],
            price: {
                amount: item.price.amount,
                currency: item.product.price.currency || item.price.currency,
            }
        }))

    });

    return res.status(200).json({
        success: true,
        message: "Order created successfully",
        order
    });

}

export const verifyOrderController = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    });
    if (!payment) {
        return res.status(404).json({
            success: false,
            message: "Payment not found or already processed."
        });
    }

    const isValidPayment = validatePaymentVerification(
        {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
        },
        razorpay_signature,
        config.RAZORPAY_KEY_SECRET
    );

    if (!isValidPayment) {
        payment.status = "failed";
        await payment.save();

        return res.status(400).json({
            success: false,
            message: "Payment verification failed."
        });
    }

    payment.status = "completed";
    payment.razorpay.paymentId = razorpay_payment_id;
    payment.razorpay.signature = razorpay_signature;

    await payment.save();

    return res.status(200).json({
        success: true,
        message: "Payment verified and order completed successfully."
    });


}