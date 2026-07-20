import {Router} from 'express';
import { registerValidatorUser } from '../validators/auth.validator.js';
import { registerUser, loginUser } from '../controller/auth.controller.js';


const router = Router();


router.post("/register", registerValidatorUser ,registerUser ); 
router.post("/login", loginUser);

export default router;