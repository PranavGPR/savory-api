import { Router } from 'express';

import {
	createOrder,
	customerLogin,
	getAllOrders,
	getCustomer,
	getOrderDetails
} from 'controllers/customer';
import { validateBody } from 'helpers';
import { createOrderValidator, customerLoginValidator } from 'validators/customer';
import { auth, isCustomer, uuidValidator } from 'middlewares';

const router = Router();

router.post('/login', validateBody(customerLoginValidator), customerLogin);
router.get('/order/:id', auth, isCustomer, uuidValidator, getOrderDetails);
router.get('/order/all/:id', auth, isCustomer, uuidValidator, getAllOrders);
router.post('/createOrder', auth, isCustomer, validateBody(createOrderValidator), createOrder);
router.get('/:id', auth, isCustomer, uuidValidator, getCustomer);

export default router;
