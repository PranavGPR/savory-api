import { Router } from 'express';

import {
	createRestaurant,
	deleteRestaurant,
	getRestaurantById,
	getRestaurants,
	getRestaurantsCount,
	updateRestaurant
} from 'controllers/admin';
import { auth, isAdmin, uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { createRestaurantValidator, updateRestaurantValidator } from 'validators/admin';

const router = Router();

router.post('/create', auth, isAdmin, validateBody(createRestaurantValidator), createRestaurant);
router.get('/all', auth, isAdmin, getRestaurants);
router.get('/getRestaurantsCount', auth, isAdmin, getRestaurantsCount);
router.put(
	'/:id',
	auth,
	isAdmin,
	uuidValidator,
	validateBody(updateRestaurantValidator),
	updateRestaurant
);
router.delete('/:id', auth, isAdmin, uuidValidator, deleteRestaurant);
router.get('/:id', auth, isAdmin, uuidValidator, getRestaurantById);

export default router;
