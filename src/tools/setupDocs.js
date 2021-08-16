import swaggerUI from 'swagger-ui-express';
import { name as appName, description, license, version } from '../../package.json';
import docs from 'docs';

const documentObject = {
	swagger: '2.0',
	info: {
		title: appName,
		description,
		license: {
			name: license
		},
		version,
		contact: {
			name: 'Pranav',
			email: 'pranavgpr232000@gmail.com',
			url: 'https://realgpr.tech'
		}
	},
	paths: docs
};

/**
 * Setup swagger docs engine
 * @param {*} app
 */
export default function setupDocs(app) {
	app.use('/docs', swaggerUI.serve, swaggerUI.setup(documentObject));
}
