import { Router } from 'express';

import { getRestaurant, restaurantLogin } from 'controllers/restaurant';
import { validateBody } from 'helpers';
import { restaurantLoginValidator } from 'validators/restaurant';
import { auth, isRestaurant, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(restaurantLoginValidator), restaurantLogin);
router.get('/:id', auth, isRestaurant, uuidValidator, getRestaurant);

export default router;
