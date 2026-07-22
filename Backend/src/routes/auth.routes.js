import {Router} from 'express';
import { registerValidatorUser,loginValidatorUser  } from '../validators/auth.validator.js';
import { registerUser, loginUser,googleCallback } from '../controller/auth.controller.js';
import passport from 'passport';

const router = Router();


router.post("/register", registerValidatorUser ,registerUser ); 
router.post("/login", loginValidatorUser, loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {session: false}), googleCallback);

export default router;

