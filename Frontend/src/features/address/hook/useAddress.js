import { useDispatch } from "react-redux";
import { createUserAddress, getUserAddress, deleteUserAddress, updateUserAddress } from "../service/address.api";
import { addAddress, setAddresses, setSelectedAddress, setLoading, setError, updateAddress, removeAddress } from "../state/addressSlice";


export const useAddress = () => {
    const dispatch = useDispatch()

    const handleCreateAddress = async (formData) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await createUserAddress(formData);

            if (response.success) {
                dispatch(addAddress(response.address));
            }
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create address.";
            dispatch(setError(message));
            return {
                success: false,
                message
            };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetUserAddress = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await getUserAddress();

            if (response.success) {
                dispatch(setAddresses(response.addresses));
            }

            return response;

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get addresses.";

            dispatch(setError(message));

            return {
                success: false,
                message
            };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSelectAddress = (address) => {
        dispatch(setSelectedAddress(address));
    };

    const handleUpdateAddress = async (addressId, formData) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await updateUserAddress(addressId, formData);
            if (response.success) {
                dispatch(updateAddress(response.address));
            }
            return response;
        } catch (error) {
            dispatch(setError(error.message));
            return { success: false, error: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await deleteUserAddress(addressId);
            if (response.success) {
                dispatch(removeAddress(addressId));
            }
            return response;
        } catch (error) {
            dispatch(setError(error.message));
            return { success: false, error: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleCreateAddress,
        handleGetUserAddress,
        handleSelectAddress,
        handleUpdateAddress,
        handleDeleteAddress
    }
}