import j2s from 'joi-to-swagger';

import { adminLoginSchema, createAdminSchema, updateAdminSchema } from 'validators/admin';
import { adminLoginExample, createAdminExample, updateAdminExample } from 'constants/admin';

const { swagger: adminLoginSwagger } = j2s(adminLoginSchema);
const { swagger: createAdminSwagger } = j2s(createAdminSchema);
const { swagger: updateAdminSwagger } = j2s(updateAdminSchema);

export default {};
