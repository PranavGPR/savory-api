import { Router } from 'express';

import AdminRouter from './admin';
import CustomerRouter from './customer';

const router = Router();

router.use('/', AdminRouter);
router.use('/customer', CustomerRouter);

export default router;
