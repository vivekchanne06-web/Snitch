import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    addresses: [],
    selectedAddress:null,
    loading: false,
    error: null,
};


const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload
        },
        addAddress: (state, action) => {
            state.addresses.push(action.payload);
        },
    }
})


export const { setAddresses,setSelectedAddress,addAddress } = addressSlice.actions
export default addressSlice.reducer