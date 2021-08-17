import j2s from 'joi-to-swagger';

import { updateOrderSchema } from 'validators/admin';
import { updateOrderExample } from 'constants/admin';

const { swagger: updateOrderSwagger } = j2s(updateOrderSchema);

export default {
	'/admin/order/all': {
		get: {
			tags: ['Admin/Order'],
			summary: 'Get all orders',
			description: 'After logging in, get all order',
			responses: {
				200: {
					description: 'Details of the orders',
					content: 'application/json'
				},
				400: {
					description: 'Enter a valid id'
				},
				401: {
					description: 'Access Denied'
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
					in: 'header',
					name: 'Authorization',
					description: 'Token for authorization',
					required: true,
					type: 'string'
				}
			]
		}
	}
};
