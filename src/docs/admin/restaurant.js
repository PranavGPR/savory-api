import j2s from 'joi-to-swagger';

import { createRestaurantSchema, updateRestaurantSchema } from 'validators/admin';
import { createRestaurantExample, updateRestaurantExample } from 'constants/admin';

const { swagger: createRestaurantSwagger } = j2s(createRestaurantSchema);
const { swagger: updateRestaurantSwagger } = j2s(updateRestaurantSchema);

export default {
	'/admin/restaurant/create': {
		post: {
			tags: ['Admin/Restaurant'],
			summary: 'Create a restaurant as an admin',
			description: 'Create restaurant after logging in as an admin',
			responses: {
				200: {
					description: `Restaurant created`,
					content: 'application/json'
				},
				400: {
					description: 'Error in inserting the values'
				},
				401: {
					description: 'Access denied'
				},
				500: {
					description: 'Internal Server error'
				}
			},
			parameters: [
				{
					in: 'path',
					name: 'token',
					description: 'Token for Authorization',
					required: true
				},
				{
					in: 'body',
					name: 'body',
					description: 'Details needed to create a restaurant',
					required: true,
					schema: {
						...createRestaurantSwagger,
						example: createRestaurantExample
					}
				}
			]
		}
	},
	'/admin/restaurant/all': {
		get: {
			tags: ['Admin/Restaurant'],
			summary: 'Get all restaurants',
			description: 'After logging in, get all restaurants',
			responses: {
				200: {
					description: 'Details of the restaurants',
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
