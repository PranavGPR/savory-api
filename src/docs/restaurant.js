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
	}
};
