import { Router } from "express";
import { aunthicateSeller } from "../middleware/auth.middleware.js";
import { addProduct } from "../controller/product.controller.js";
import multer from "multer";    
import { addProductValidator } from "../validators/product.validator.js";

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
 });

const router = Router();


router.post('/add/product', aunthicateSeller,upload.array('images', 6),addProductValidator ,addProduct);

export default router;