import { Router } from 'express';

import { getRestaurant, getRestaurantOrders, restaurantLogin } from 'controllers/restaurant';
import { validateBody } from 'helpers';
import { restaurantLoginValidator } from 'validators/restaurant';
import { auth, isRestaurant, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(restaurantLoginValidator), restaurantLogin);
router.get('/order/:id', auth, isRestaurant, uuidValidator, getRestaurantOrders);
router.get('/:id', auth, isRestaurant, uuidValidator, getRestaurant);

export default router;
