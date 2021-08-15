import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from './functions';

let server;
let id;
let values = {
	id,
	menuid: '77e39eec-a0a4-4efc-a971-bf0a8427aa88',
	name: 'A2D Restaurant',
	phoneNumber: '9750844039',
	email: 'restaurant1@email.com',
	address: '4/1252, Street',
	city: 'Madurai',
	pincode: '625020',
	cuisines: JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
	opening_time: '2021-08-15 08:00:00',
	closing_time: '2021-08-15 20:00:00',
	popular_dishes: JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
	people_say: JSON.stringify(['Good Service']),
	more_info: JSON.stringify(['Valet Parking']),
	password: '$2b$10$vTkWCMemROvuX639knNLvONS92BAOLaIx76W9GspYkrNISyztqLDy'
};

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
			values.id = uuidv4();

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(values)
			);

			payload.password = 'Pranav@23';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 200 if data are correct', async () => {
			values.id = uuidv4();

			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(values)
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
			values.id = uuidv4();
			token = generateBearerToken('restaurant');
			await query('insert into customers(id,name,phoneNumber,email,password) values(?,?,?,?,?)', [
				'9629ea6a-2854-4f5c-8501-a67e343837dd',
				'Pranav',
				'9750844039',
				'pranav@email.com',
				'Pranav@23'
			]);
			await query(
				'insert into restaurants(id, menuid, name, phoneNumber, email, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				Object.values(values)
			);
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

			let orderValues = {
				customerid: '9629ea6a-2854-4f5c-8501-a67e343837dd',
				restaurantid: 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
				status: 'delivered',
				delivered_on: '08:00:00',
				ordered_item: JSON.stringify([
					{ name: 'Idly', quantity: '4' },
					{ name: 'Dosa', quantity: '1' }
				]),
				amount: 200,
				payment_mode: 'COD'
			};

			await query(
				'insert into orders(id, customerid, restaurantid, status,delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
				[id, ...Object.values(orderValues)]
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});
