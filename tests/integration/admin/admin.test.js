import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

let server;

describe('/admin/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(() => {
		server.close();
	});

	describe('GET admin/', () => {
		const exec = () => {
			return request(server).get('/admin/all');
		};

		it('should get all admins', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
