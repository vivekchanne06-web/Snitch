import {Router} from 'express';
import { registerValidatorUser } from '../validators/auth.validator.js';


const router = Router();


router.post("/register", registerValidatorUser ); 

export default router;