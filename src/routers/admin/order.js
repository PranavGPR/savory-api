import { Router } from 'express';

import { deleteOrder, getOrderById, getOrders, updateOrder } from 'controllers/admin';
import { auth, isAdmin, uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { updateOrderValidator } from 'validators/admin';

const router = Router();

router.get('/all', auth, isAdmin, getOrders);
router.get('/:id', auth, isAdmin, uuidValidator, getOrderById);
router.put('/:id', auth, isAdmin, uuidValidator, validateBody(updateOrderValidator), updateOrder);
router.delete('/:id', auth, isAdmin, uuidValidator, deleteOrder);

export default router;
