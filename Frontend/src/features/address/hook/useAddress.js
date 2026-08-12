import { useDispatch} from "react-redux";
import { createAddress,getUserAddress } from "../service/address.api";
import { addAddress,setAddresses,setSelectedAddress } from "../state/addressSlice";


export const useAddress = () => {
    const dispatch = useDispatch()

    const handleCreateAddress = async (formData) => {
        const response = await createAddress(formData)
        if(response.success){
            dispatch(addAddress(response.address))
        }
        return response
    }

    const handleGetUserAddress = async () => {
        const response = await getUserAddress()
        if(response.success){
            dispatch(setAddresses(response.addresses))
        }
        return response
    }
    const handleSelectAddress = (address) => {
        dispatch(setSelectedAddress(address));
    };

    return {
        handleCreateAddress,
        handleGetUserAddress,
        handleSelectAddress
    }
}