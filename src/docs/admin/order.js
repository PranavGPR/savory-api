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
	},
	'/admin/order/{id}': {
		get: {
			tags: ['Admin/Order'],
			summary: 'Get a order',
			description: 'Get details of a order by their id',
			responses: {
				200: {
					description: 'Details of a order',
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
					in: 'path',
					name: 'id',
					description: 'ID of the order needed to get details',
					required: true
				},
				{
					in: 'header',
					name: 'Authorization',
					description: 'Token for authorization',
					required: true,
					type: 'string'
				}
			]
		},
		put: {
			tags: ['Admin/Order'],
			summary: 'Update order details',
			description: 'After logging in, update the details of a order',
			responses: {
				200: {
					description: 'Successfully updated',
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
				},
				{
					in: 'body',
					name: 'body',
					description: 'Details needed to update an admin',
					required: true,
					schema: {
						...updateOrderSwagger,
						example: updateOrderExample
					}
				},
				{
					in: 'path',
					name: 'id',
					description: 'ID of the order needed to update details',
					required: true
				}
			]
		}
	}
};
