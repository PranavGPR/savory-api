import { Router } from 'express';

import { createOrder, customerLogin } from 'controllers/customer';
import { validateBody } from 'helpers';
import { createOrderValidator, customerLoginValidator } from 'validators/customer';
import { auth, isCustomer, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(customerLoginValidator), customerLogin);
router.post('/createOrder', auth, isCustomer, validateBody(createOrderValidator), createOrder);

export default router;
