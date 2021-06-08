import { Router } from 'express';

import { createAdmin, deleteAdmin, getAdminById, getAdmins, updateAdmin } from 'controllers/admin';

const router = Router();

router.post('/create', createAdmin);
router.put('/update', updateAdmin);
router.delete('/delete/:id', deleteAdmin);
router.get('/all', getAdmins);
router.get('/:id', getAdminById);

export default router;
