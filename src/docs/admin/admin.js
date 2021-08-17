import j2s from 'joi-to-swagger';

import { adminLoginSchema, createAdminSchema, updateAdminSchema } from 'validators/admin';
import { adminLoginExample, createAdminExample, updateAdminExample } from 'constants/admin';

const { swagger: adminLoginSwagger } = j2s(adminLoginSchema);
const { swagger: createAdminSwagger } = j2s(createAdminSchema);
const { swagger: updateAdminSwagger } = j2s(updateAdminSchema);

export default {
	'/admin/login': {
		post: {
			tags: ['Admin'],
			summary: 'Login as admin',
			description: 'Login to the server as a admin to manage orders.',
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
					description: 'Details needed to login as an admin',
					required: true,
					schema: {
						...adminLoginSwagger,
						example: adminLoginExample
					}
				}
			]
		}
	},
	'/admin/create': {
		post: {
			tags: ['Admin'],
			summary: 'Create an admin',
			description: 'Create other admins after logging in as an admin',
			responses: {
				200: {
					description: `You're logged in`,
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
					description: 'Details needed to create an admin',
					required: true,
					schema: {
						...createAdminSwagger,
						example: createAdminExample
					}
				}
			]
		}
	}
};
