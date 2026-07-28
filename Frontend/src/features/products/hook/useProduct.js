import { addProduct ,getSellerProduct, getAllProducts,getProductDetail} from "../services/product.api.js"
import {useDispatch} from "react-redux"
import {setSellerProducts,setProducts} from "../state/product.slice.js"

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

    async function handleAllProducts(){
        try{
           const data = await getAllProducts()
           dispatch(setProducts(data.products))
           return data.products
        }catch(err){
            throw err
        }

    }
    
    async function handleGetProductDetail(ProductId){
        try {
            const data= await getProductDetail(ProductId)
            return data.product;
        } catch (error) {
            throw error;
        }

    }


    return{
        handleAddProduct,
        handleGetSellerProducts,
        handleAllProducts,
        handleGetProductDetail,
    }
}   