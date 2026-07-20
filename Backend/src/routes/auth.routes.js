import {Router} from 'express';
import { registerValidatorUser,loginValidatorUser  } from '../validators/auth.validator.js';
import { registerUser, loginUser } from '../controller/auth.controller.js';


const router = Router();


router.post("/register", registerValidatorUser ,registerUser ); 
router.post("/login", loginValidatorUser, loginUser);

export default router;