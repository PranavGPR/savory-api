import { Router } from 'express';

import {
	createCustomer,
	deleteCustomer,
	getCustomerById,
	getCustomers,
	updateCustomer
} from 'controllers/admin';
import { auth, isAdmin, uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { createCustomerValidator, updateCustomerValidator } from 'validators/admin';

const router = Router();

router.post('/create', auth, isAdmin, validateBody(createCustomerValidator), createCustomer);
router.get('/all', auth, isAdmin, getCustomers);
router.put(
	'/:id',
	auth,
	isAdmin,
	uuidValidator,
	validateBody(updateCustomerValidator),
	updateCustomer
);
router.delete('/:id', auth, isAdmin, uuidValidator, deleteCustomer);
router.get('/:id', auth, isAdmin, uuidValidator, getCustomerById);

export default router;
