import { Router } from 'express';

import { restaurantLogin } from 'controllers/restaurant';

const router = Router();

router.post('/login', restaurantLogin);

export default router;
