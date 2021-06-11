import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';

let server;
let id;

describe('/admin/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(() => {
		server.close();
	});

	describe('GET admin/', () => {
		afterEach(async () => {
			await query('delete from admin');
		});

		const exec = () => {
			return request(server).get('/admin/all');
		};

		it('should return 404 if admin not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should get all admins', async () => {
			id = uuidv4();

			await query('insert into admin(id,name,password,email,profileImg) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com',
				'image'
			]);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET admin by ID', () => {
		let id;

		beforeEach(() => {
			id = 'test';
		});

		afterEach(async () => {
			await query('delete from admin');
		});

		const exec = () => {
			return request(server).get(`/admin/${id}`);
		};

		it('should return 400 if id is not valid', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should return 404 is admin does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should return 200 if admin exists', async () => {
			id = uuidv4();
			await query('insert into admin(id,name,password,email,profileImg) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com',
				'image'
			]);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
