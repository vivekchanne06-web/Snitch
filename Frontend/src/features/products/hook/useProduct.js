import { addProduct ,getSellerProduct} from "../services/product.api.js"
import {useDispatch} from "react-redux"
import {setSellerProducts} from "../state/product.slice.js"

export const useProduct = ()=>{
    const dispatch = useDispatch()

    async function handleAddProduct(FormData){
        try {
            const data= await addProduct(FormData)
            return data.product;
        } catch (error) {
            throw error;
        }
    }

    async function handleGetSellerProducts(){
        try {
            const data= await getSellerProduct()
            dispatch(setSellerProducts(data.products))
            return data.product;
        } catch (error) {
            throw error;
        }
    }
    return{
        handleAddProduct,
        handleGetSellerProducts,
    }
}   