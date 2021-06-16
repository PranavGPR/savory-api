import { Router } from 'express';

import { createRestaurant, getRestaurants } from 'controllers/admin';
import { uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { createRestaurantValidator, updateRestaurantValidator } from 'validators/admin/restaurant';

const router = Router();

router.post('/create', validateBody(createRestaurantValidator), createRestaurant);
router.get('/all', getRestaurants);
router.put('/:id', uuidValidator, updateRestaurantValidator, updateCustomer);
router.delete('/:id', uuidValidator, deleteCustomer);
router.get('/:id', uuidValidator, getCustomerById);

export default router;
