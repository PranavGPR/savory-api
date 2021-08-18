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
			url: 'https://github.com/PranavGPR/savory-api'
		}
	},
	paths: docs
};

/**
 * Setup swagger docs engine
 * @param {*} app
 */
export default function setupDocs(app) {
	app.use('/', swaggerUI.serve, swaggerUI.setup(documentObject));
}
