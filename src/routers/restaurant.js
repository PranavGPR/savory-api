import { Router } from 'express';

import {
	getRestaurant,
	getRestaurantOrders,
	newOrders,
	restaurantLogin
} from 'controllers/restaurant';
import { validateBody } from 'helpers';
import { restaurantLoginValidator } from 'validators/restaurant';
import { auth, isRestaurant, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(restaurantLoginValidator), restaurantLogin);
router.get('/order/:id', auth, isRestaurant, uuidValidator, getRestaurantOrders);
router.get('/newOrder/:id', auth, isRestaurant, uuidValidator, newOrders);
router.get('/:id', auth, isRestaurant, uuidValidator, getRestaurant);

export default router;
