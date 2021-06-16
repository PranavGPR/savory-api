import request from 'supertest';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';

let server;
let id;
let payload;

describe('/restaurant/', () => {
	beforeEach(() => {
		server = require('../../../src/server');
	});
	afterEach(() => {
		server.close();
	});

	describe('GET customer/', () => {
		afterEach(async () => {
			await query('delete from restaurant');
		});

		const exec = () => {
			return request(server).get('/admin/restaurant/all');
		};

		it('should return 404 if no restaurants found', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should get all restaurants', async () => {
			id = uuidv4();

			await query(
				'insert into restaurant(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				[
					id,
					'77e39eec-a0a4-4efc-a971-bf0a8427aa88',
					'Restaurant',
					'9750844040',
					'restaurant1@email.com',
					'4/1252, Street',
					'Madurai',
					'625020',
					JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
					'08:00:00',
					'20:00:00',
					JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
					JSON.stringify(['Good service']),
					JSON.stringify(['Valet Parking'])
				]
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
			await query('delete from restaurant');
		});

		const exec = () => {
			return request(server).get(`/admin/restaurant/${id}`);
		};

		it('should return 400 if id is not valid', async () => {
			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 404 is restaurant does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

			const res = await exec();
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if restaurant exists', async () => {
			id = uuidv4();

			await query(
				'insert into restaurant(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				[
					id,
					'77e39eec-a0a4-4efc-a971-bf0a8427aa88',
					'Restaurant',
					'9750844040',
					'restaurant1@email.com',
					'4/1252, Street',
					'Madurai',
					'625020',
					JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
					'08:00:00',
					'20:00:00',
					JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
					JSON.stringify(['Good service']),
					JSON.stringify(['Valet Parking'])
				]
			);

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});

	describe('PUT /:id', () => {
		id = uuidv4();
		payload = {
			name: 'Pranav'
		};

		beforeEach(async () => {
			await query(
				'insert into restaurant(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				[
					id,
					'77e39eec-a0a4-4efc-a971-bf0a8427aa88',
					'Restaurant',
					'9750844040',
					'restaurant1@email.com',
					'4/1252, Street',
					'Madurai',
					'625020',
					JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
					'08:00:00',
					'20:00:00',
					JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
					JSON.stringify(['Good service']),
					JSON.stringify(['Valet Parking'])
				]
			);
		});

		afterEach(async () => {
			await query('delete from restaurant');
		});

		const exec = () => {
			return request(server).put(`/admin/restaurant/${id}`).send(payload);
		};

		it('should return 400 if id is not valid', async () => {
			id = 'test';

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

		it('should return 200 if one field is updated', async () => {
			payload.name = 'GPR';
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});

		it('should return 200 if more than one fields are updated', async () => {
			payload.name = 'GPR';
			payload.opening_time = '08:10:00';
			payload.phoneNumber = '9750844039';

			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully updated');
		});
	});

	describe('DELETE /:id', () => {
		id = uuidv4();

		beforeEach(async () => {
			await query(
				'insert into restaurant(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
				[
					id,
					'77e39eec-a0a4-4efc-a971-bf0a8427aa88',
					'Restaurant',
					'9750844040',
					'restaurant1@email.com',
					'4/1252, Street',
					'Madurai',
					'625020',
					JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
					'08:00:00',
					'20:00:00',
					JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
					JSON.stringify(['Good service']),
					JSON.stringify(['Valet Parking'])
				]
			);
		});

		afterEach(async () => {
			await query('delete from restaurant');
		});

		const exec = () => {
			return request(server).delete(`/admin/restaurant/${id}`);
		};

		it('should return 400 if id is not valid', async () => {
			id = 'test';

			const res = await exec();

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error', 'Enter a valid id');
		});

		it('should return 404 if restaurant does not exists', async () => {
			id = '77e39eec-a0a4-4efc-a971-bf0a8427aa81';

			const res = await exec();

			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('error', 'No records found');
		});

		it('should return 200 if restaurant is deleted', async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message', 'Successfully deleted');
		});
	});

	describe('POST /create', () => {
		payload = {
			name: 'Restaurant',
			address: '4/1252, Street',
			city: 'Madurai',
			pincode: '625020',
			cuisines: JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
			opening_time: '08:00:00',
			closing_time: '20:00:00',
			popular_dishes: JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
			people_say: JSON.stringify(['Good service']),
			more_info: JSON.stringify(['Valet Parking'])
		};

		afterEach(async () => {
			await query('delete from restaurant');
		});

		const exec = () => {
			return request(server).post('/admin/restaurant/create').send(payload);
		};

		it('should return 404 if any fields are not provided', async () => {
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 200 if restaurant is added', async () => {
			payload.email = 'pranav@email.com';
			payload.phoneNumber = '9750844039';

			const res = await exec();

			expect(res.status).toBe(200);
		});
	});
});