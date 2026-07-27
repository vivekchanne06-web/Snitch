import {Router} from 'express';
import { registerValidatorUser,loginValidatorUser  } from '../validators/auth.validator.js';
import { registerUser, loginUser,googleCallback, getCurrentUser } from '../controller/auth.controller.js';
import passport from 'passport';
import { aunthicateUser } from '../middleware/auth.middleware.js';

const router = Router();


router.post("/register", registerValidatorUser ,registerUser ); 
router.post("/login", loginValidatorUser, loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {session: false,failureRedirect: '/login'}), googleCallback);

router.get('/me', aunthicateUser, getCurrentUser);

export default router;

