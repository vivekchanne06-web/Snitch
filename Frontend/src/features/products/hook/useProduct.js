import { useCallback } from "react"
import { addProduct, getSellerProduct, getAllProducts, getProductDetail, addVariant } from "../services/product.api.js"
import { useDispatch } from "react-redux"
import { setSellerProducts, setProducts } from "../state/product.slice.js"

export const useProduct = () => {
    const dispatch = useDispatch()

    const handleAddProduct = useCallback(async (FormData) => {
        try {
            const data = await addProduct(FormData)
            return data.product;
        } catch (error) {
            throw error;
        }
    }, [])

    const handleGetSellerProducts = useCallback(async () => {
        try {
            const data = await getSellerProduct()
            dispatch(setSellerProducts(data.products))
            return data.product;
        } catch (error) {
            throw error;
        }
    }, [dispatch])

    const handleAllProducts = useCallback(async () => {
        try {
            const data = await getAllProducts()
            dispatch(setProducts(data.products))
            return data.products
        } catch (err) {
            throw err
        }
    }, [dispatch])

    const handleGetProductDetail = useCallback(async (ProductId) => {
        try {
            const data = await getProductDetail(ProductId)
            return data.product;
        } catch (error) {
            throw error;
        }
    }, [])

    const handleAddProductVarient = useCallback(async (ProductId, newProductVarient) => {
        try {
            const data = await addVariant(ProductId, newProductVarient)
            return data
        } catch (error) {
            throw error;
        }
    }, [])

    return {
        handleAddProduct,
        handleGetSellerProducts,
        handleAllProducts,
        handleGetProductDetail,
        handleAddProductVarient,
    }
}