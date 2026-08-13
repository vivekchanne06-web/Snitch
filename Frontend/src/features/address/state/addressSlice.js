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
         updateAddress: (state, action) => {
            const updatedAddress = action.payload;

            const index = state.addresses.findIndex(
                (address) => address._id === updatedAddress._id
            );

            if (index !== -1) {
                state.addresses[index] = updatedAddress;
            }
        },
        removeAddress: (state, action) => {
            state.addresses = state.addresses.filter(
                (address) => address._id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})


export const { setAddresses,setSelectedAddress,addAddress, updateAddress, removeAddress,setLoading,setError } = addressSlice.actions
export default addressSlice.reducer 