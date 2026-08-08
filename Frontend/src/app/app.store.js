import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import productReducer from "../features/products/state/product.slice";
import chatReducer from "../features/cart/state/cart.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product : productReducer,
        cart: chatReducer
    }
})