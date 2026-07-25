import { Router } from "express";
import { aunthicateSeller } from "../middleware/auth.middleware.js";
import { addProduct,getProduct } from "../controller/product.controller.js";
import multer from "multer";    
import { addProductValidator } from "../validators/product.validator.js";

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
 });

const router = Router();


router.post('/api/products/add', aunthicateSeller,upload.array('images', 6),addProductValidator ,addProduct);

router.get('/api/products/seller', aunthicateSeller, getProduct);

export default router;