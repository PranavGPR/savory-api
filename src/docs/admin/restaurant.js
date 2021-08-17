import j2s from 'joi-to-swagger';

import { createRestaurantSchema, updateRestaurantSchema } from 'validators/admin';
import { createRestaurantExample, updateRestaurantExample } from 'constants/admin';

const { swagger: createRestaurantSwagger } = j2s(createRestaurantSchema);
const { swagger: updateRestaurantSwagger } = j2s(updateRestaurantSchema);

export default {};
