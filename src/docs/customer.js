import j2s from 'joi-to-swagger';

import { createOrderSchema, customerLoginSchema } from 'validators/customer';
import { customerLoginExample } from 'constants/customer';

const { swagger: createOrderSwagger } = j2s(createOrderSchema);
const { swagger: customerLoginSwagger } = j2s(customerLoginSchema);

export default {
	'/customer/login': {
		post: {
			tags: ['Customer'],
			summary: 'Login as customer',
			description: 'Login to the server as a customer to manage orders.',
			responses: {
				200: {
					description: `You're logged in`,
					content: 'application/json'
				},
				404: {
					description: 'No records found'
				},
				500: {
					description: 'Internal Server error'
				}
			},
			parameters: [
				{
					in: 'body',
					name: 'body',
					description: 'Details needed to login as a customer',
					required: true,
					schema: {
						...customerLoginSwagger,
						example: customerLoginExample
					}
				}
			]
		}
	}
};
