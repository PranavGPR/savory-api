import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { validateCustomer } from 'validators';
import { sendFailure, sendSuccess } from 'helpers';

/**
 * Controllers for all /admin/customer routes
 *
 * Available controllers: createCustomer, getAllCustomer, getCustomer, deleteCustomer
 */

/**
 * Create a customer
 * @param { name, password, email, phoneNumber, address, city, pincode }
 * @returns 'Successfully Inserted' | 'Error in inserting the values'
 */

export const createCustomer = async (req, res) => {
	const { body } = req;
	const id = uuidv4();

	const { error } = validateCustomer(body);
	if (error) return sendFailure(res, { error: error.details[0].message });

	const { name, password, phoneNumber, email, address, city, pincode } = body;

	const result = await query(
		'insert into customer(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
		[id, name, phoneNumber, email, password, address, city, pincode]
	);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully inserted!' });

	return sendFailure(res, { error: 'Error in inserting the values' }, StatusCodes.BAD_REQUEST);
};

/**
 * Get all customers
 * @param {}
 * @returns [customers] | 'No records found!'
 */
export const getCustomers = async (req, res) => {
	const result = await query('select * from customer');

	if (!result) return sendFailure(res, { message: 'No records found!' });

	return sendSuccess(res, { result });
};

/**
 * Get a customer by ID
 * @param {id}
 * @returns [customer] | 'No records found!'
 */
export const getCustomerById = async (req, res) => {
	const { id } = req.params;

	const result = await query('select * from customer where id=?', [id]);

	if (!result) return sendFailure(res, { message: 'No records found!' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Delete a customer
 * @param {id}
 * @returns 'Customer Deleted' | 'No records found!'
 */

export const deleteCustomer = async (req, res) => {
	const { id } = req.params;

	const result = await query('delete from customer where id=?', [id]);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully deleted!' });

	return sendFailure(res, { message: 'No records found!' });
};

/**
 * Update a customer
 * @param {id, name, phoneNumber, address, city, pincode}
 * @returns 'Customer Updated' | 'No records found!'
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

	const result = await query(`update customer set ${fields} where id=?`, objValues);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated' });

	return sendFailure(res, { message: 'No records found!' });
};
