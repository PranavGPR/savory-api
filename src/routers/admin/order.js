import { Router } from 'express';

import { deleteOrder, getOrderById, getOrders, updateOrder } from 'controllers/admin';
import { uuidValidator } from 'middlewares';
import { validateBody } from 'helpers';
import { updateOrderValidator } from 'validators/admin';

const router = Router();

router.get('/all', getOrders);
router.get('/:id', uuidValidator, getOrderById);
router.put('/:id', uuidValidator, validateBody(updateOrderValidator), updateOrder);
router.delete('/:id', uuidValidator, deleteOrder);

export default router;
