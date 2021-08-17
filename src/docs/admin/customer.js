import j2s from 'joi-to-swagger';

import { createCustomerSchema, updateCustomerSchema } from 'validators/admin';
import { createCustomerExample, updateCustomerExample } from 'constants/admin';

const { swagger: createCustomerSwagger } = j2s(createCustomerSchema);
const { swagger: updateCustomerSwagger } = j2s(updateCustomerSchema);

export default {};
