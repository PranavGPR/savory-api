import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {query} from 'helpers/dbConnection';
import request from 'supertest';
import {v4 as uuidv4} from 'uuid';

import {restaurantValues} from '../constants';
import {generateBearerToken} from '../functions';

let server;
let id;

describe('/restaurant/', () => {
  beforeEach(() => { server = require('../../../src/server'); });
  afterEach(async () => { await server.close(); });

  describe('GET customer/', () => {
    let token;

    beforeEach(() => { token = generateBearerToken('admin'); });

    afterEach(async () => { await query('delete from restaurants'); });

    const exec = () => {
      return request(server)
          .get('/admin/restaurant/all')
          .set('Authorization', token);
    };

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 404 if no restaurants found', async () => {
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'No records found');
    });

    it('should get all restaurants', async () => {
      id = uuidv4();

      await query(
          'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          Object.values(restaurantValues));

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

    afterEach(async () => { await query('delete from restaurants'); });

    const exec = () => {
      return request(server)
          .get(`/admin/restaurant/${id}`)
          .set('Authorization', token);
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

    it('should return 404 is restaurant does not exists', async () => {
      id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'No records found');
    });

    it('should return 200 if restaurant exists', async () => {
      id = 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d';

      await query(
          'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          Object.values(restaurantValues));

      const res = await exec();

      expect(res.status).toBe(200);
    });
  });

  describe('PUT /:id', () => {
    let token;
    id = uuidv4();
    let payload = {name : 'Pranav'};

    beforeEach(async () => {
      await query(
          'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          Object.values(restaurantValues));

      token = generateBearerToken('admin');
    });

    afterEach(async () => { await query('delete from restaurants'); });

    const exec = () => {
      return request(server)
          .put(`/admin/restaurant/${id}`)
          .set('Authorization', token)
          .send(payload);
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

    it('should return 404 if restaurant does not exists', async () => {
      id = '77e39eec-a0a4-4efc-a971-bf0a8427aa88';

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'No records found');
    });

    it('should return 200 if one field is updated', async () => {
      id = 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d';
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
    let token;
    id = uuidv4();

    beforeEach(async () => {
      await query(
          'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          Object.values(restaurantValues));
      token = generateBearerToken('admin');
    });

    afterEach(async () => { await query('delete from restaurants'); });

    const exec = () => {
      return request(server)
          .delete(`/admin/restaurant/${id}`)
          .set('Authorization', token);
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

    it('should return 404 if restaurant does not exists', async () => {
      id = '77e39eec-a0a4-4efc-a971-bf0a8427aa81';

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'No records found');
    });

    it('should return 200 if restaurant is deleted', async () => {
      id = 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d';
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Successfully deleted');
    });
  });

  describe('POST /create', () => {
    let token;
    let payload = {
      name : 'Restaurant',
      address : '4/1252, Street',
      city : 'Madurai',
      pincode : '625020',
      cuisines : JSON.stringify([ 'Chinese', 'North Indian', 'South Indian' ]),
      opening_time : '08:00:00',
      closing_time : '20:00:00',
      popular_dishes : JSON.stringify([ 'Tikka Gravy', 'Paneer Masala' ]),
      people_say : JSON.stringify([ 'Good service' ]),
      more_info : JSON.stringify([ 'Valet Parking' ]),
      password : '$2b$10$vTkWCMemROvuX639knNLvONS92BAOLaIx76W9GspYkrNISyztqLDy'
    };

    beforeEach(() => { token = generateBearerToken('admin'); });

    afterEach(async () => { await query('delete from restaurants'); });

    const exec = () => {
      return request(server)
          .post('/admin/restaurant/create')
          .send(payload)
          .set('Authorization', token);
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

    it('should return 200 if restaurant is added', async () => {
      payload.email = 'pranav@email.com';
      payload.phoneNumber = '9750844039';

      const res = await exec();

      expect(res.status).toBe(200);
    });
  });

  describe('GET /count', () => {
    let token;

    beforeEach(() => { token = generateBearerToken('admin'); });

    const exec = () => {
      return request(server)
          .get('/admin/restaurant/count')
          .set('Authorization', token);
    };

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 200 if restaurants are found', async () => {
      await query(
          'insert into restaurants(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          Object.values(restaurantValues));

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('result');
      expect(typeof res.body.result).toBe('number');
    });

    it('should return 404 if no records found', async () => {
      await query('delete from restaurants');
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'No records found');
    });
  });
});
