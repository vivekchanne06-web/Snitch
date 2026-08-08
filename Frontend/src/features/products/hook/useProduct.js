import { useCallback } from "react"
import { addProduct, getSellerProduct, getAllProducts, getProductDetail, addVariant, deleteProduct, updateVarient, deleteVariant } from "../services/product.api.js"
import { useDispatch } from "react-redux"
import { setSellerProducts, setProducts, setCurrentProduct, updateCurrentProductVariant, deleteCurrentProductVariant } from "../state/product.slice.js"

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleAddProduct = useCallback(async (FormData) => {
        try {
            const data = await addProduct(FormData);
            return data.product;
        } catch (error) {
            throw error;
        }
    }, []);

    const handleGetSellerProducts = useCallback(async () => {
        try {
            const data = await getSellerProduct();

            dispatch(setSellerProducts(data.products));

            return data.products;
        } catch (error) {
            throw error;
        }
    }, [dispatch]);

    const handleAllProducts = useCallback(async () => {
        try {
            const data = await getAllProducts();

            dispatch(setProducts(data.products));

            return data.products;
        } catch (error) {
            throw error;
        }
    }, [dispatch]);

    const handleGetProductDetail = useCallback(async (ProductId) => {
        try {
            const data = await getProductDetail(ProductId);

            dispatch(setCurrentProduct(data.product));

            return data.product;
        } catch (error) {
            throw error;
        }
    }, [dispatch]);

    const handleAddProductVarient = useCallback(async (ProductId, newProductVarient) => {
            try {
                const data = await addVariant(
                    ProductId,
                    newProductVarient
                );
                if (data.success && data.product) {
                    dispatch(setCurrentProduct(data.product));
                }

                return data;
            } catch (error) {
                throw error;
            }
        },
        [dispatch]
    );

    const handleProductDelete = useCallback(
        async (ProductId) => {
            try {
                const data = await deleteProduct(ProductId);

                if (data.success) {
                    dispatch(setCurrentProduct(null));
                }

                return data;
            } catch (error) {
                throw error;
            }
        },
        [dispatch]
    );

    const handleupdateProductVarient = useCallback(
        async (ProductId, VariantId, updateVariant) => {
            try {
                const data = await updateVarient(
                    ProductId,
                    VariantId,
                    updateVariant
                );

                if (data.success && data.product) {
                    const updatedVariant = data.product.variants.find(
                        (variant) => variant._id === VariantId
                    );

                    if (updatedVariant) {
                        dispatch(
                            updateCurrentProductVariant(updatedVariant)
                        );
                    }
                }

                return data;
            } catch (error) {
                throw error;
            }
        },
        [dispatch]
    );

    const handleProductVarientDelete = useCallback(
        async (ProductId, VariantId) => {
            try {
                const data = await deleteVariant(
                    ProductId,
                    VariantId
                );

                if (data.success) {
                    dispatch(
                        deleteCurrentProductVariant(VariantId)
                    );
                }

                return data;
            } catch (error) {
                throw error;
            }
        },
        [dispatch]
    );

    return {
        handleAddProduct,
        handleGetSellerProducts,
        handleAllProducts,
        handleGetProductDetail,
        handleProductDelete,
        handleAddProductVarient,
        handleupdateProductVarient,
        handleProductVarientDelete
    };
};