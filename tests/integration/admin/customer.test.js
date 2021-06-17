import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';

let server;
let id;
let payload;

describe('/customer/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(() => {
		server.close();
	});

	describe('GET customer/', () => {
		afterEach(async () => {
			await query('delete from customer');
		});

		const exec = () => {
			return request(server).get('/admin/customer/all');
		};

		it('should return 404 if no customers found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should get all customers', async () => {
			id = uuidv4();
			await query(
				'insert into customer(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
				[id, 'Pranav', 9750844039, 'pranav123@email.com', '12345678', '', '', '']
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /:id', () => {
		beforeEach(() => {
			id = 'test';
		});

		afterEach(async () => {
			await query('delete from customer');
		});

		const exec = () => {
			return request(server).get(`/admin/customer/${id}`);
		};

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
				'insert into customer(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
				[id, 'Pranav', 9750844039, 'pranav123@email.com', '12345678', '', '', '']
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /:id', () => {
		id = uuidv4();
		payload = {
			name: 'GPR'
		};

		beforeEach(async () => {
			await query('insert into customer(id,name,phoneNumber,email,password) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'pranav@email.com',
				'Pranav@23'
			]);
		});

		afterEach(async () => {
			await query('delete from customer');
		});

		const exec = () => {
			return request(server).put(`/admin/customer/${id}`).send(payload);
		};

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
			payload.name = 'GPR';
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});

		it('should return 200 if more than one fields are updated', async () => {
			payload.name = 'GPR';
			payload.email = 'pranav@email.com';
			payload.password = 'pranav_23';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});
	});

	describe('DELETE /:id', () => {
		id = uuidv4();

		beforeEach(async () => {
			await query('insert into customer(id,name,phoneNumber,email,password) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'pranav@email.com',
				'Pranav@23'
			]);
		});

		afterEach(async () => {
			await query('delete from customer');
		});

		const exec = () => {
			return request(server).delete(`/admin/customer/${id}`);
		};

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
		payload = {
			name: 'Pranav',
			password: 'Pranav@23'
		};

		afterEach(async () => {
			await query('delete from customer');
		});

		const exec = () => {
			return request(server).post('/admin/customer/create').send(payload);
		};

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
});
