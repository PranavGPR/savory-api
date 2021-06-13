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

	describe('GET /all', () => {
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

	describe('GET /:id', () => {
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

	describe('PUT /:id', () => {
		let id = uuidv4();
		let payload = {
			name: 'GPR',
			profileImg: 'img'
		};

		beforeEach(async () => {
			await query('insert into admin(id,name,password,email,profileImg) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com',
				'image'
			]);
		});

		afterEach(async () => {
			await query('delete from admin');
		});

		const exec = () => {
			return request(server).put(`/admin/${id}`).send(payload);
		};

		it('should return 400 if id is not valid', async () => {
			id = 'test';

			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 404 if admin does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found!');
		});

		it('should return 200 if one field is updated', async () => {
			delete payload.profileImg;

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated!');
		});

		it('should return 200 if both the fields are updated', async () => {
			(payload.name = 'GPR'), (payload.profileImg = 'img');

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated!');
		});
	});

	describe('DELETE /:id', () => {
		let id = uuidv4();
		let payload = {
			name: 'GPR',
			profileImg: 'img'
		};

		beforeEach(async () => {
			await query('insert into admin(id,name,password,email,profileImg) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'Pranav@23',
				'pranav@email.com',
				'image'
			]);
		});

		afterEach(async () => {
			await query('delete from admin');
		});

		const exec = () => {
			return request(server).delete(`/admin/${id}`).send(payload);
		};

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
			expect(res.body).toHaveProperty('error', 'No records found!');
		});

		it('should return 200 if admin is deleted', async () => {
			(payload.name = 'GPR'), (payload.profileImg = 'img');

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully deleted!');
		});
	});

	describe('POST /create', () => {
		let payload = {
			name: 'Pranav',
			password: 'Pranav@23',
			email: 'pranav123@email.com'
		};

		afterEach(async () => {
			await query('delete from admin');
		});

		const exec = () => {
			return request(server).post('/admin/create').send(payload);
		};

		it('should return 404 if any fields are not provided', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if admin is added', async () => {
			payload.profileImg = 'image';
			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
