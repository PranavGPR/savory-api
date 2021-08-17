import j2s from 'joi-to-swagger';

import { updateOrderSchema } from 'validators/admin';
import { updateOrderExample } from 'constants/admin';

const { swagger: updateOrderSwagger } = j2s(updateOrderSchema);

export default {};
