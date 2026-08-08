import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';
import { stockOfVarient } from '../dao/product.dao.js';


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
    const user = req.user

    let cart = await cartModel.findOne({ user: user._id })
        .populate("items.product")

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        cart: cart
    })
}