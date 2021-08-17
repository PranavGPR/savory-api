import j2s from 'joi-to-swagger';

import { createOrderSchema, customerLoginSchema } from 'validators/customer';
import { createOrderExample, customerLoginExample } from 'constants/customer';

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
	},
	'/customer/{id}': {
		get: {
			tags: ['Customer'],
			summary: 'Get details of a customer',
			description: 'After logging in, get the details of a customer with their id',
			responses: {
				200: {
					description: 'Details of the customer',
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
					description: 'ID needed to get details of a customer',
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
		}
	},
	'/customer/createOrder': {
		post: {
			tags: ['Customer'],
			summary: 'Create an order',
			description: 'Order a food as a customer',
			responses: {
				200: {
					description: 'Order placed',
					content: 'application/json'
				},
				400: {
					description: 'Enter required details'
				},
				401: {
					description: 'Access Denied'
				},
				404: {
					description: 'Error in creating an order'
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
						...createOrderSwagger,
						example: createOrderExample
					}
				},
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
	'/customer/order/{id}': {
		get: {
			tags: ['Customer'],
			summary: 'Get an order details of a customer',
			description: 'After logging in, get the details of an order of a customer with its id',
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
					in: 'path',
					name: 'id',
					description: 'ID of the order needed to get details of that order',
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
		}
	},
	'/customer/order/all/{id}': {
		get: {
			tags: ['Customer'],
			summary: 'Get all order details of a customer',
			description: 'After logging in, get the details of all orders of a customer with their id',
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
					in: 'path',
					name: 'id',
					description: 'ID of the customer needed to get details of all their orders',
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
		}
	}
};
