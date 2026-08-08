import { Router } from "express";
import { aunthicateSeller } from "../middleware/auth.middleware.js";
import { addProduct,getProduct,getAllProducts,getProductDetail,addVariant,updateVariant,deleteVariant,deleteProduct } from "../controller/product.controller.js";
import multer from "multer";    
import { addProductValidator } from "../validators/product.validator.js";

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
 });

const router = Router();


router.post('/add', aunthicateSeller,upload.array('images', 7),addProductValidator ,addProduct);

router.patch('/:productId/variants/:variantId', aunthicateSeller, upload.array('images', 7),updateVariant);

router.delete('/:productId/variants/:variantId', aunthicateSeller, deleteVariant);

router.delete('/:productId', aunthicateSeller, deleteProduct);

router.get('/seller', aunthicateSeller, getProduct);

router.get('/',getAllProducts);

router.get('/detail/:id',getProductDetail);

router.post("/:productId/variants", aunthicateSeller, upload.array('images', 7), addProductValidator, addVariant);

export default router;