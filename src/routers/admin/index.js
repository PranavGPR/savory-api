import { Router } from 'express';

import AdminRouter from './admin';
import CustomerRouter from './customer';
import RestaurantRouter from './restaurant';
import OrderRouter from './order';

const router = Router();

router.use('/', AdminRouter);
router.use('/customer', CustomerRouter);
router.use('/restaurant', RestaurantRouter);
router.use('/order', OrderRouter);

export default router;
