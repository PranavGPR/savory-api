import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

let server;

describe('/customer/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(() => {
		server.close();
	});

	describe('GET customer/', () => {
		const exec = () => {
			return request(server).get('/admin/customer/all');
		};

		it('should get all customers', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
