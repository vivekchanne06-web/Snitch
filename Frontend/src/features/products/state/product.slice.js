import {createSlice}  from "@reduxjs/toolkit"

const productSlice =createSlice({
    name : "product",
    initialState : {
        sellerProducts : [],
    },
    reducers : {
        setSellerProducts : (state,action) => {
            state.sellerProducts = action.payload;
        },
    },  
})

export default productSlice.reducer;

export const {setSellerProducts} = productSlice.actions;  