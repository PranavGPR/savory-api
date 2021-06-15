import { Router } from 'express';

import AdminRouter from './admin';
import CustomerRouter from './customer';
import RestaurantRouter from './restaurant';

const router = Router();

router.use('/', AdminRouter);
router.use('/customer', CustomerRouter);
router.use('/restaurant', RestaurantRouter);

export default router;
