import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateBearerToken } from './functions';

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
				email: 'pranavg@email.com',
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
			id = uuidv4();
			await query('insert into customers(id,name,phoneNumber,password,email) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'12345678910',
				'pranavg@email.com'
			]);

			payload.password = 'Pranav@23';
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Email or Password incorrect');
		});

		it('should return 200 if data are correct', async () => {
			await query('insert into customers(id,name,phoneNumber,password,email) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'$2b$10$vTkWCMemROvuX639knNLvONS92BAOLaIx76W9GspYkrNISyztqLDy',
				'pranavg@email.com'
			]);

			payload.password = '12345678';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			expect(res.body).toHaveProperty('name');
		});

		it('should return 200 if phoneNumber given is correct', async () => {
			await query('insert into customers(id,name,phoneNumber,password,email) values(?,?,?,?,?)', [
				id,
				'Pranav',
				'9750844039',
				'$2b$10$vTkWCMemROvuX639knNLvONS92BAOLaIx76W9GspYkrNISyztqLDy',
				'pranavg@email.com'
			]);

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
			restaurantid: '064aecbc-2704-4fa2-b493-b946841ea29c',
			status: 'delivered',
			delivered_on: '08:00:00',
			ordered_item: JSON.stringify([
				{ name: 'Idly', quantity: '4' },
				{ name: 'Dosa', quantity: '1' }
			])
		};

		beforeEach(async () => {
			token = generateBearerToken('customer');
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
});
