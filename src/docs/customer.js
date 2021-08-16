import j2s from 'joi-to-swagger';

import { createOrderValidator, customerLoginValidator } from 'validators/customer';

const { swagger: createOrderSchema } = j2s(createOrderValidator);
const { swagger: customerLoginSchema } = j2s(customerLoginValidator);

export default {};
