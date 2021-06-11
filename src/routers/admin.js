import { Router } from 'express';

import {
	createAdmin,
	createCustomer,
	deleteAdmin,
	deleteCustomer,
	getAdminById,
	getAdmins,
	getCustomerById,
	getCustomers,
	updateAdmin,
	updateCustomer
} from 'controllers/admin';
import { uuidValidator } from 'middlewares';

const router = Router();

router.post('/create', createAdmin);
router.get('/all', getAdmins);
router.put('/:id', uuidValidator, updateAdmin);
router.delete('/:id', uuidValidator, deleteAdmin);
router.get('/:id', uuidValidator, getAdminById);

router.post('/customer/create', createCustomer);
router.get('/customer/all', getCustomers);
router.put('/customer/:id', uuidValidator, updateCustomer);
router.delete('/customer/:id', uuidValidator, deleteCustomer);
router.get('/customer/:id', uuidValidator, getCustomerById);

export default router;
