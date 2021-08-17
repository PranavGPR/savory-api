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
					description: `Admin created`,
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
	},
	'/admin/all': {
		get: {
			tags: ['Admin'],
			summary: 'Get all admins',
			description: 'After logging in, get all admins',
			responses: {
				200: {
					description: 'Details of the admins',
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
	'/admin/{id}': {
		get: {
			tags: ['Admin'],
			summary: 'Get an admin',
			description: 'Get details of an admin by their id',
			responses: {
				200: {
					description: 'Details of an admin',
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
					description: 'ID of the admin needed to get details',
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
			tags: ['Admin'],
			summary: 'Update name of admin',
			description: 'After logging in, update the details of an admin',
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
				},
				{
					in: 'body',
					name: 'body',
					description: 'Details needed to update an admin',
					required: true,
					schema: {
						...updateAdminSwagger,
						example: updateAdminExample
					}
				},
				{
					in: 'path',
					name: 'id',
					description: 'ID of the admin needed to update their details',
					required: true
				}
			]
		},
		delete: {
			tags: ['Admin'],
			summary: 'Delete an admin',
			description: 'Delete other admin by id',
			responses: {
				200: {
					description: 'Admin deleted',
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
					in: 'path',
					name: 'id',
					description: 'ID of the admin needed to update their details',
					required: true
				}
			]
		}
	}
};
