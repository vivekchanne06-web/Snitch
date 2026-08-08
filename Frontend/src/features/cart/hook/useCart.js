import { addItemInCart, getCartDetails,incrementQuantityInCart,decrementQuantityInCart } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { setCart, incrementQuantity, decrementQuantity } from "../state/cart.slice"

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

    async function handleIncrement(productId, variantId) {
        try {
            const data = await incrementQuantityInCart({ productId, variantId });
            if(data.success){
                dispatch(incrementQuantity({ productId, variantId }));
                console.log("Item incremented successfully");
            }else{
                console.error(data.message);
            }
            
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    }

    async function handleDecrement(productId, variantId) {
        try {
            const data = await decrementQuantityInCart({ productId, variantId });
            if(data.success){
                dispatch(decrementQuantity({ productId, variantId }));
                console.log("Item decremented successfully");
            }else{
                console.error(data.message);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    }

    return {
        handleAddToCart,
        handleGetCart,
        handleIncrement,
        handleDecrement
    }


}