import { Router } from 'express';

import {
	completedOrders,
	getRestaurant,
	getRestaurantOrders,
	newOrders,
	OnProgressOrders,
	restaurantLogin
} from 'controllers/restaurant';
import { validateBody } from 'helpers';
import { restaurantLoginValidator } from 'validators/restaurant';
import { auth, isRestaurant, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(restaurantLoginValidator), restaurantLogin);
router.get('/order/:id', auth, isRestaurant, uuidValidator, getRestaurantOrders);
router.get('/newOrder/:id', auth, isRestaurant, uuidValidator, newOrders);
router.get('/completedOrders/:id', auth, isRestaurant, uuidValidator, completedOrders);
router.get('/onProgressOrders/:id', auth, isRestaurant, uuidValidator, OnProgressOrders);
router.get('/:id', auth, isRestaurant, uuidValidator, getRestaurant);

export default router;
