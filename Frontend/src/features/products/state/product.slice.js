import {createSlice}  from "@reduxjs/toolkit"

const productSlice =createSlice({
    name : "product",
    initialState : {
        sellerProducts : [],
        products : [],
        currentProduct:null, 
    },
    reducers : {
        setSellerProducts : (state,action) => {
            state.sellerProducts = action.payload;
        },
        setProducts : (state,action) => {
            state.products = action.payload;
        },
        setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    updateCurrentProductVariant: (state, action) => {
      if (!state.currentProduct || !state.currentProduct._id) return;

      // Find the variant to update
      const updatedVariant = action.payload;

      // Update the specific variant in the currentProduct
      state.currentProduct = {
        ...state.currentProduct,
        variants: (state.currentProduct.variants || []).map((variant) =>
          variant._id === updatedVariant._id ? updatedVariant : variant
        ),
      };
    },

    deleteCurrentProductVariant: (state, action) => {
      if (!state.currentProduct || !state.currentProduct._id) return;

      const variantId = action.payload;

      // Remove the variant from the currentProduct
      state.currentProduct = {
        ...state.currentProduct,
        variants: (state.currentProduct.variants || []).filter(
          (variant) => variant._id !== variantId
        ),
      };
    },
    },  
})

export default productSlice.reducer;

export const {setSellerProducts, setProducts,setCurrentProduct,updateCurrentProductVariant,deleteCurrentProductVariant} = productSlice.actions;  