import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from '../functions';

let server;
let id;

describe('/customer/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(async () => {
		await server.close();
	});

	describe('GET /all', () => {
		let token;

		afterEach(async () => {
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).get('/admin/customer/all').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if no customers found', async () => {
			token = generateBearerToken('admin');
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should get all customers', async () => {
			id = uuidv4();
			await query(
				'insert into customers(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
				[id, 'Pranav', '9750844039', 'pranav123@email.com', '12345678', '', '', '']
			);

			token = generateBearerToken('admin');

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
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).get(`/admin/customer/${id}`).set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id is not valid', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 404 is customer does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if customer exists', async () => {
			id = uuidv4();
			await query(
				'insert into customers(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
				[id, 'Pranav', 9750844039, 'pranav123@email.com', '12345678', '', '', '']
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /:id', () => {
		let token;
		id = uuidv4();
		let payload = {
			name: 'GPR'
		};

		beforeEach(async () => {
			await query('insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'pranav@email.com',
				'Pranav@23'
			]);
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).put(`/admin/customer/${id}`).set('Authorization', token).send(payload);
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

		it('should return 404 if customer does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if one field is updated', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});

		it('should return 200 if more than one fields are updated', async () => {
			payload.phoneNumber = '9750844040';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});
	});

	describe('DELETE /:id', () => {
		let token;
		id = uuidv4();

		beforeEach(async () => {
			await query('insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'pranav@email.com',
				'Pranav@23'
			]);
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).delete(`/admin/customer/${id}`).set('Authorization', token);
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

		it('should return 404 if customer does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa81';

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if customer is deleted', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully deleted');
		});
	});

	describe('POST /create', () => {
		let token;
		let payload = {
			name: 'Pranav',
			password: 'Pranav@23'
		};

		beforeEach(() => {
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from customers');
		});

		const exec = () => {
			return request(server)
				.post('/admin/customer/create')
				.set('Authorization', token)
				.send(payload);
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

		it('should return 200 if customer is added', async () => {
			payload.email = 'pranav@email.com';
			payload.phoneNumber = '9750844039';

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /count', () => {
		let token;

		beforeEach(() => {
			token = generateBearerToken('admin');
		});

		const exec = () => {
			return request(server).get('/admin/customer/count').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 200 if customers are found', async () => {
			id = uuidv4();
			await query(
				'insert into customers(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
				[id, 'Pranav', 9750844039, 'pranav123@email.com', '12345678', '', '', '']
			);

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('result');
			expect(typeof res.body.result).toBe('number');
		});

		it('should return 404 if no records found', async () => {
			await query('delete from customers');
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});
	});
});
