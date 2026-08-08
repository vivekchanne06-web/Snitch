import router from 'express';
import { addToCart,getCart} from '../controller/cart.controller.js';
import {aunthicateUser} from '../middleware/auth.middleware.js'
import { addToCartValidator } from '../validators/cart.validator.js';

const cartRouter = router();

cartRouter.post('/add/:productId/:variantId',aunthicateUser,addToCartValidator,addToCart)

cartRouter.get('/',aunthicateUser,getCart)

export default cartRouter;