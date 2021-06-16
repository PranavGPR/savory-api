import { Router } from 'express';

import {
	createRestaurant,
	deleteRestaurant,
	getRestaurantById,
	getRestaurants,
	updateRestaurant
} from 'controllers/admin';
import { uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { createRestaurantValidator, updateRestaurantValidator } from 'validators/admin';

const router = Router();

router.post('/create', validateBody(createRestaurantValidator), createRestaurant);
router.get('/all', getRestaurants);
router.put('/:id', uuidValidator, validateBody(updateRestaurantValidator), updateRestaurant);
router.delete('/:id', uuidValidator, deleteRestaurant);
router.get('/:id', uuidValidator, getRestaurantById);

export default router;
