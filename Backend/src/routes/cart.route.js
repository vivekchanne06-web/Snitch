import router from 'express';
import { addToCart,getCart,incrementQuantity,decrementQuantity} from '../controller/cart.controller.js';
import {aunthicateUser} from '../middleware/auth.middleware.js'
import { addToCartValidator,incrementQuantityValidator,decrementQuantityValidator } from '../validators/cart.validator.js';

const cartRouter = router();

cartRouter.post('/add/:productId/:variantId',aunthicateUser,addToCartValidator,addToCart)

cartRouter.get('/',aunthicateUser,getCart)

cartRouter.patch('/quantity/increase/:productId/:variantId',aunthicateUser,incrementQuantityValidator,incrementQuantity)

cartRouter.patch('/quantity/decrease/:productId/:variantId',aunthicateUser,decrementQuantityValidator,decrementQuantity)

export default cartRouter;