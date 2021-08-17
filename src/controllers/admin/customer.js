import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { query } from 'helpers/dbConnection';
import { sendFailure, sendSuccess } from 'helpers';

/**
 * Controllers for all /admin/customer routes
 *
 * Available controllers: createCustomer, getAllCustomer, getCustomer, deleteCustomer, updateCustomer
 */

/**
 * Create a customer
 * @param { name, password, email, phoneNumber, address, city, pincode }
 * @returns 'Successfully Inserted' | 'Error in inserting the values'
 */

export const createCustomer = async (req, res) => {
	let {
		body: { name, password, phoneNumber, email, address, city, pincode }
	} = req;
	const id = uuidv4();

	password = await bcrypt.hash(password, 10);

	const result = await query(
		'insert into customers(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
		[id, name, phoneNumber, email, password, address, city, pincode]
	);

	if (result.affectedRows) return sendSuccess(res, { error: 'Successfully inserted' });

	return sendFailure(res, { error: 'Error in inserting the values' }, StatusCodes.BAD_REQUEST);
};

/**
 * Get all customers
 * @param {}
 * @returns [customers] | 'No records found'
 */
export const getCustomers = async (_req, res) => {
	const result = await query('select * from customers');

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Get a customer by ID
 * @param {id}
 * @returns [customer] | 'No records found'
 */
export const getCustomerById = async (req, res) => {
	const { id } = req.params;

	const result = await query('select * from customers where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Delete a customer
 * @param {id}
 * @returns 'Customer Deleted' | 'No records found'
 */

export const deleteCustomer = async (req, res) => {
	const { id } = req.params;

	const result = await query('delete from customers where id=?', [id]);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully deleted' });

	return sendFailure(res, { error: 'No records found' });
};

/**
 * Update a customer
 * @param {id, name, phoneNumber, address, city, pincode, email, password}
 * @returns 'Customer Updated' | 'No records found'
 */

export const updateCustomer = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	let fields = '';
	Object.keys(body).forEach((val, ind) => {
		fields += ind + 1 === Object.keys(body).length ? `${val}=?` : `${val}=?,`;
	});

	let objValues = Object.values(body);
	objValues.push(id);

	const result = await query(`update customers set ${fields} where id=?`, objValues);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated' });

	return sendFailure(res, { error: 'No records found' });
};

/**
 *
 * Get count of customers
 *
 * @route: /getCustomersCount
 * @method: GET
 * @requires: body{}
 * @returns: {count(customers)}
 *
 */

export const getCustomersCount = async (_req, res) => {
	const result = await query('select count(name) from customers');

	const countValue = Object.values(result[0])[0];

	if (!countValue) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: countValue });
};
