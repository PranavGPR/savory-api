import { Router } from 'express';

import { createAdmin } from 'controllers/admin';

const router = Router();

router.post('/create', createAdmin);

export default router;
