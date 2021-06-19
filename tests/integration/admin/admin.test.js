import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from '../functions';

let server;
let id;

describe('/admin/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(async () => {
		await server.close();
	});

	describe('POST /login', () => {
		let payload;

		const exec = () => {
			return request(server).post('/admin/login').send(payload);
		};

		beforeEach(() => {
			payload = {
				email: 'pranavg@email.com',
				password: 'Pranav@23'
			};
		});

		afterEach(async () => {
			await query('delete from admins');
		});

		it('should return 400 if some field are missing', async () => {
			delete payload.email;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 404 if admin not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 400 if password is wrong', async () => {
			await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
				id,
				'Pranav',
				'12345678910',
				'pranavg@email.com'
			]);

			payload.password = '12345678';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 200 if data are correct', async () => {
			await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
				id,
				'Pranav',
				'$2b$10$..llFHfb1wjxA.c4YnZ9Uu2w0rbJVYPFBTa3fxchhKaKHRpdedzUO',
				'pranavg@email.com'
			]);

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});
	});

	describe('GET /all', () => {
		let token;

		beforeEach(() => {
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from admins');
		});

		const exec = () => {
			return request(server).get('/admin/all').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if admin not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should get all admins', async () => {
			id = uuidv4();

			await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com'
			]);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /:id', () => {
		let token;

		beforeEach(() => {
			id = 'test';
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from admins');
		});

		const exec = () => {
			return request(server).get(`/admin/${id}`).set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

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
			await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com'
			]);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /:id', () => {
		let token;
		let payload;

		beforeEach(async () => {
			id = uuidv4();
			token = generateBearerToken('admin');
			await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com'
			]);
		});

		afterEach(async () => {
			await query('delete from admins');
		});

		const exec = () => {
			return request(server).put(`/admin/${id}`).set('Authorization', token).send(payload);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id is not valid', async () => {
			id = 'test';

			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 404 if admin does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';
			payload = {
				name: 'GPR'
			};

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if admin is updated', async () => {
			payload = {
				name: 'GPR'
			};

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});
	});

	describe('DELETE /:id', () => {
		let token;
		id = uuidv4();

		beforeEach(async () => {
			token = generateBearerToken('admin');

			await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com'
			]);
		});

		afterEach(async () => {
			await query('delete from admins');
		});

		const exec = () => {
			return request(server).delete(`/admin/${id}`).set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id is not valid', async () => {
			id = 'test';

			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 404 if admin does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa81';

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if admin is deleted', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully deleted');
		});
	});

	describe('POST /create', () => {
		let token;
		let payload;

		beforeEach(() => {
			token = generateBearerToken('admin');
			payload = {
				name: 'Pranav',
				password: 'Pranav@23'
			};
		});

		afterEach(async () => {
			await query('delete from admins');
		});

		const exec = () => {
			return request(server).post('/admin/create').set('Authorization', token).send(payload);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if any fields are not provided', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if admin is added', async () => {
			payload.email = 'pranav@email.com';
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
