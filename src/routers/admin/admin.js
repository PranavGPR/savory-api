import { Router } from 'express';

import {
	adminLogin,
	createAdmin,
	deleteAdmin,
	getAdminById,
	getAdmins,
	getAdminsCount,
	updateAdmin,
	updateAdminPassword
} from 'controllers/admin';
import { auth, isAdmin, uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import {
	adminLoginValidator,
	createAdminValidator,
	updateAdminPasswordValidator,
	updateAdminValidator
} from 'validators/admin';

const router = Router();

router.post('/login', validateBody(adminLoginValidator), adminLogin);
router.post('/create', auth, isAdmin, validateBody(createAdminValidator), createAdmin);
router.get('/all', auth, isAdmin, getAdmins);
router.get('/count', auth, isAdmin, getAdminsCount);
router.put('/:id', auth, isAdmin, uuidValidator, validateBody(updateAdminValidator), updateAdmin);
router.put(
	'/password/:id',
	auth,
	isAdmin,
	uuidValidator,
	validateBody(updateAdminPasswordValidator),
	updateAdminPassword
);
router.delete('/:id', auth, isAdmin, uuidValidator, deleteAdmin);
router.get('/:id', auth, isAdmin, uuidValidator, getAdminById);

export default router;
