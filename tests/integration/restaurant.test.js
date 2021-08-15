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
});
