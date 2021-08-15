import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from './functions';
import { customerValues, orderValues, restaurantValues } from './constants';

let server;
let id;

describe('/restaurant/', () => {
	beforeEach(() => {
		server = require('../../src/server');
	});
	afterEach(async () => {
		await server.close();
	});

	describe('POST /login', () => {
		let payload;

		const exec = () => {
			return request(server).post('/restaurant/login').send(payload);
		};

		beforeEach(() => {
			payload = {
				email: 'restaurant1@email.com',
				password: '12345678'
			};
		});

		afterEach(async () => {
			await query('delete from restaurants');
		});

		it('should return 404 if some field are missing', async () => {
			delete payload.password;
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error');
		});

		it('should return 404 if restaurant not found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 400 if password is wrong', async () => {
			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			payload.password = 'Pranav@23';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 200 if data are correct', async () => {
			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			payload.password = '12345678';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});
	});

	describe('GET /order/:id', () => {
		let token;

		beforeEach(async () => {
			id = 'test';
			token = generateBearerToken('restaurant');

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query('insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)', [
				'9629ea6a-2854-4f5c-8501-a67e343837dd',
				'Pranav',
				'9750844039',
				'pranav@email.com',
				'Pranav@23'
			]);
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from customers');
			await query('delete from restaurants');
		});

		const exec = () => {
			return request(server).get(`/restaurant/order/${id}`).set('Authorization', token);
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
			id = 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d';

			await query(
				'insert into orders(id, customerid, restaurantid, status,delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[id, ...Object.values(orderValues)]
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /:id', () => {
		let token;

		beforeEach(() => {
			id = 'test';
			token = generateBearerToken('restaurant');
		});

		afterEach(async () => {
			await query('delete from restaurants');
		});

		const exec = () => {
			return request(server).get(`/restaurant/${id}`).set('Authorization', token);
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

		it('should return 404 if restaurant does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if restaurant exists', async () => {
			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			id = 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d';

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('GET /newOrder/:id', () => {
		let token;

		beforeEach(() => {
			id = 'test';
			token = generateBearerToken('restaurant');
		});

		afterEach(async () => {
			await query('delete from orders');
			await query('delete from restaurants');
			await query('delete from customers');
		});

		const exec = () => {
			return request(server).get(`/restaurant/newOrder/${id}`).set('Authorization', token);
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

		it('should return 404 if new orders does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if new orders exists', async () => {
			id = '9629ea6a-2854-4f5c-8501-a67e343837dd';

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(restaurantValues)
			);

			await query(
				'insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)',
				Object.values(customerValues)
			);

			orderValues.status = 'ordered';

			await query(
				'insert into orders(id, customerid, restaurantid, status,delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[id, ...Object.values(orderValues)]
			);

			id = 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d';

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
