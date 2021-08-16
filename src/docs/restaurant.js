import j2s from 'joi-to-swagger';

import { restaurantLoginSchema } from 'validators/restaurant';
import { restaurantLoginExample } from 'constants/restaurant';

const { swagger: loginSchema } = j2s(restaurantLoginSchema);

export default {
	'/restaurant/login': {
		post: {
			tags: ['restaurant'],
			summary: 'Login as restaurant',
			description: 'Login to the server as a restaurant to manage orders.',
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
					description: 'Details needed to login as a restaurant',
					required: true,
					schema: {
						...loginSchema,
						example: restaurantLoginExample
					}
				}
			]
		}
	},
	'/restaurant/{id}': {
		get: {
			tags: ['restaurant'],
			summary: 'Get details of a restaurant',
			description: 'After logging in, get the details of a restaurant with its id',
			responses: {
				200: {
					description: 'Details of the restaurant',
					content: 'application/json'
				},
				400: {
					description: 'Enter a valid id'
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
					description: 'ID needed to get details of a restaurant',
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
