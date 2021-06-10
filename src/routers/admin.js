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

const router = Router();

router.post('/customer/create', createCustomer);
router.get('/customer/all', getCustomers);
router.put('/customer/:id', updateCustomer);
router.delete('/customer/:id', deleteCustomer);
router.get('/customer/:id', getCustomerById);

router.post('/create', createAdmin);
router.get('/all', getAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.get('/:id', getAdminById);

export default router;
