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
					description: 'Details needed to login as a admin',
					required: true,
					schema: {
						...adminLoginSwagger,
						example: adminLoginExample
					}
				}
			]
		}
	}
};
