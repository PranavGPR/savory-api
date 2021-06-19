import { Router } from 'express';

import {
	adminLogin,
	createAdmin,
	deleteAdmin,
	getAdminById,
	getAdmins,
	updateAdmin
} from 'controllers/admin';
import { auth, isAdmin, uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { adminLoginValidator, createAdminValidator, updateAdminValidator } from 'validators/admin';

const router = Router();

router.post('/login', validateBody(adminLoginValidator), adminLogin);
router.post('/create', auth, isAdmin, validateBody(createAdminValidator), createAdmin);
router.get('/all', auth, isAdmin, getAdmins);
router.put('/:id', auth, isAdmin, uuidValidator, validateBody(updateAdminValidator), updateAdmin);
router.delete('/:id', auth, isAdmin, uuidValidator, deleteAdmin);
router.get('/:id', auth, isAdmin, uuidValidator, getAdminById);

export default router;
