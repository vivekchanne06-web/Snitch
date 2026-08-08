import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementQuantity:(state, action)=>{
            const {productId, variantId} = action.payload;

            state.items = state.items.map(item => {
                if(
                    item.product._id.toString() === productId &&
                    item.variant.toString() === variantId
                ){
                    return { ...item, quantity: item.quantity + 1}
                }
                return item;
            })
        },
        decrementQuantity:(state, action)=>{
            const {productId, variantId} = action.payload;

             state.items = state.items.map(item => {
                if(
                    item.product._id.toString() === productId &&
                    item.variant.toString() === variantId
                ){
                    return { ...item, quantity: item.quantity - 1}
                }
                return item;
            })   
        }
    }
})

export const { setCart, addItem, incrementQuantity, decrementQuantity } = cartSlice.actions
export default cartSlice.reducer