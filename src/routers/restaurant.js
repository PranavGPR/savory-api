import { Router } from 'express';

import { restaurantLogin } from 'controllers/restaurant';
import { validateBody } from 'helpers';
import { restaurantLoginValidator } from 'validators/restaurant';

const router = Router();

router.post('/login', validateBody(restaurantLoginValidator), restaurantLogin);

export default router;
