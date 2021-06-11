import { Router } from 'express';

import { createAdmin, deleteAdmin, getAdminById, getAdmins, updateAdmin } from 'controllers/admin';
import { uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { createAdminValidator } from 'validators/admin';

const router = Router();

router.post('/create', validateBody(createAdminValidator), createAdmin);
router.get('/all', getAdmins);
router.put('/:id', uuidValidator, updateAdmin);
router.delete('/:id', uuidValidator, deleteAdmin);
router.get('/:id', uuidValidator, getAdminById);

export default router;
