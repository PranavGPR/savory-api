import { Router } from 'express';

import { customerLogin } from 'controllers/customer';
import { validateBody } from 'helpers';
import { customerLoginValidator } from 'validators/customer';

const router = Router();

router.post('/login', validateBody(customerLoginValidator), customerLogin);

export default router;
