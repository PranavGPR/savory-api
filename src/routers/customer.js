import { Router } from 'express';

import { createOrder, customerLogin, getAllOrders, getOrderDetails } from 'controllers/customer';
import { validateBody } from 'helpers';
import { createOrderValidator, customerLoginValidator } from 'validators/customer';
import { auth, isCustomer, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(customerLoginValidator), customerLogin);
router.get('/order/:id', auth, isCustomer, uuidValidator, getOrderDetails);
router.get('/order/all/:id', auth, isCustomer, uuidValidator, getAllOrders);
router.post('/createOrder', auth, isCustomer, validateBody(createOrderValidator), createOrder);

export default router;
