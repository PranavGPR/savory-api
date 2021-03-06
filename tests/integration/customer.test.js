import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from './functions';
import { customerValues, orderValues, restaurantValues } from './constants';

let server;
let id;

describe('/customer/', () => {
	beforeEach(() => {
		server = require('../../src/server');
	});
	afterEach(async () => {
		await server.close();
	});

	describe('POST /login', () => {
		let payload;

		const exec = () => {
			return request(server).post('/customer/login').send(payload);
		};

		beforeEach(() => {
			payload = {
				email: 'pranav@email.com',
				password: '12345678'
			};
		});

		afterEach(async () => {
			await query('delete from customers');
		});

		it('should return 404 if some field are missing', async () => {
			delete payload.password;
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 404 if customer not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 400 if password is wrong', async () => {
			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			payload.password = 'Pranav@23';

			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 200 if data are correct', async () => {
			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			payload.password = '12345678';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});

		it('should return 200 if phoneNumber given is correct', async () => {
			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			delete payload.email;
			payload.phoneNumber = 9750844039;

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});
	});

	describe('POST /createOrder', () => {
		let token;
		let payload = {
			customerid: '9629ea6a-2854-4f5c-8501-a67e343837dd',
			restaurantid: 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
			status: 'delivered',
			delivered_on: '08:00:00',
			ordered_item: JSON.stringify([
				{ name: 'Idly', quantity: '4' },
				{ name: 'Dosa', quantity: '1' }
			])
		};

		beforeEach(async () => {
			token = generateBearerToken('customer');

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from customers');
			await query('delete from restaurants');
		});

		const exec = () => {
			return request(server)
				.post('/customer/createOrder')
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

		it('should return 200 if order is created', async () => {
			payload.payment_mode = 'COD';
			payload.amount = 200;

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /:id', () => {
		let token;

		beforeEach(() => {
			id = 'test';
			token = generateBearerToken('customer');
		});

		afterEach(async () => {
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).get(`/customer/${id}`).set('Authorization', token);
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

		it('should return 404 if customer does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if customer exists', async () => {
			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			id = '9629ea6a-2854-4f5c-8501-a67e343837dd';

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /order/all/:id', () => {
		let token;

		beforeEach(async () => {
			id = 'test';
			token = generateBearerToken('customer');

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from customers');
			await query('delete from restaurants');
		});

		const exec = () => {
			return request(server).get(`/customer/order/all/${id}`).set('Authorization', token);
		};

		it('should return 400 if id is not valid', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 404 if no orders found', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if orders are found', async () => {
			id = '9629ea6a-2854-4f5c-8501-a67e343837dd';

			await query(
				'insert into orders(id, customerid, restaurantid, status,delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[id, ...Object.values(orderValues)]
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /order/:id', () => {
		let token;

		beforeEach(async () => {
			id = test;
			token = generateBearerToken('customer');

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from customers');
			await query('delete from restaurants');
		});

		const exec = () => {
			return request(server).get(`/customer/order/${id}`).set('Authorization', token);
		};

		it('should return 401 if unauthorized', async () => {
			token = '';
			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 400 if id is invalid', async () => {
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

		it('should return 200 if order exists', async () => {
			id = uuidv4();

			await query(
				'insert into orders(id, customerid, restaurantid, status,delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[id, ...Object.values(orderValues)]
			);
		});
	});
});
