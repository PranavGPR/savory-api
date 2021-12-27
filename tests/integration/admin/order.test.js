import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from '../functions';
import { customerValues, restaurantValues } from '../constants';

let server;
let id;

describe('/order/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(() => {
		server.close();
	});

	describe('GET order/', () => {
		let token;

		beforeEach(() => {
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from restaurants');
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).get('/admin/order/all').set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if no orders found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should get all orders', async () => {
			id = uuidv4();

			await query(
				'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			await query(
				'insert into orders(id, customerid, restaurantid, status, delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[
					id,
					'9629ea6a-2854-4f5c-8501-a67e343837dd',
					'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
					'delivered',
					'2021-06-15 08:00:00',
					JSON.stringify([
						{
							name: 'Idly',
							quantity: '4'
						},
						{
							name: 'Dosa',
							quantity: '2'
						}
					]),
					'200',
					'COD'
				]
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /:id', () => {
		let token;

		beforeEach(async () => {
			id = 'test';
			token = generateBearerToken('admin');
			await query(
				'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from restaurants');
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).get(`/admin/order/${id}`).set('Authorization', token);
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

		it('should return 404 is order does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if order exists', async () => {
			id = uuidv4();

			await query(
				'insert into orders(id, customerid, restaurantid, status, delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[
					id,
					'9629ea6a-2854-4f5c-8501-a67e343837dd',
					'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
					'delivered',
					'2021-06-15 08:00:00',
					JSON.stringify([
						{
							name: 'Idly',
							quantity: '4'
						},
						{
							name: 'Dosa',
							quantity: '2'
						}
					]),
					'200',
					'COD'
				]
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /:id', () => {
		let token;
		id = uuidv4();
		let payload = {
			status: 'delivering'
		};

		beforeEach(async () => {
			await query(
				'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			await query(
				'insert into orders(id, customerid, restaurantid, status, delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[
					id,
					'9629ea6a-2854-4f5c-8501-a67e343837dd',
					'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
					'delivered',
					'2021-06-15 08:00:00',
					JSON.stringify([
						{
							name: 'Idly',
							quantity: '4'
						},
						{
							name: 'Dosa',
							quantity: '2'
						}
					]),
					'200',
					'COD'
				]
			);
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from restaurants');
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).put(`/admin/order/${id}`).set('Authorization', token).send(payload);
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

		it('should return 404 if order does not exists', async () => {
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
			payload.payment_mode = 'Net Banking';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});
	});

	describe('DELETE /:id', () => {
		let token;
		id = uuidv4();

		beforeEach(async () => {
			await query(
				'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			await query(
				'insert into orders(id, customerid, restaurantid, status, delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[
					id,
					'9629ea6a-2854-4f5c-8501-a67e343837dd',
					'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
					'delivered',
					'2021-06-15 08:00:00',
					JSON.stringify([
						{
							name: 'Idly',
							quantity: '4'
						},
						{
							name: 'Dosa',
							quantity: '2'
						}
					]),
					'200',
					'COD'
				]
			);
			token = generateBearerToken('admin');
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from restaurants');
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).delete(`/admin/order/${id}`).set('Authorization', token);
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

		it('should return 404 if order does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa81';

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if order is deleted', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully deleted');
		});
	});
});
