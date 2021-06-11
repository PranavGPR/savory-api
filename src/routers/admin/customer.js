import { Router } from 'express';

import {
	createCustomer,
	deleteCustomer,
	getCustomerById,
	getCustomers,
	updateCustomer
} from 'controllers/admin';
import { uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { createAdminValidator } from 'validators/admin';

const router = Router();

router.post('/create', createCustomer);
router.get('/all', getCustomers);
router.put('/:id', uuidValidator, updateCustomer);
router.delete('/:id', uuidValidator, deleteCustomer);
router.get('/:id', uuidValidator, getCustomerById);

export default router;
