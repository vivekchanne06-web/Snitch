import { addItemInCart, getCartDetails } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { setCart } from "../state/cart.slice"

export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddToCart(productId, variantId) {
    try {
        const data = await addItemInCart({ productId, variantId });

        dispatch(setCart(data.cart.items));

        console.log("Item added successfully");
    } catch (error) {
        console.error(error.response?.data?.message || error.message);
    }
}

    async function handleGetCart() {
        try {
            const data = await getCartDetails()
            dispatch(setCart(data.cart.items));
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    }

    return {
        handleAddToCart,
        handleGetCart
    }


}