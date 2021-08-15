import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateToken, sendFailure, sendSuccess } from 'helpers';

/**
 * Create a order
 * @param {id, customerid, restaurantid, status, delivered_on, ordered_item, amount, payment_mode}
 * @returns 'Successfully created an order' | 'Invalid details'
 */

export const createOrder = async (req, res) => {
	const { body } = req;

	const id = uuidv4();

	const result = await query(
		'insert into orders(id, customerid, restaurantid, status,delivered_on, ordered_item, amount, payment_mode) values(?,?,?,?,?,?,?,?)',
		[id, ...Object.values(body)]
	);

	if (!result.affectedRows) return sendFailure(res, { error: 'Error in creating an order' });

	return sendSuccess(res, { message: 'Order created' });
};

/**
 * Get all order history of a customer
 * @param {customerid}
 * @returns '[orders]' | 'No records found!'
 */

export const getAllOrders = async (req, res) => {
	const {
		params: { id }
	} = req;

	const result = await query('select * from orders where customerid=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Get order details of a particular order
 * @param {id}
 * @returns '{order}' | 'No records found!'
 */

export const getOrderDetails = async (req, res) => {
	const {
		params: { id }
	} = req;

	const result = await query('select * from orders where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Update a customer
 * @param {id, address, city, pincode}
 * @returns 'Successfully Updated' | 'No records found!'
 */

export const updateCustomer = async (req, res) => {
	const {
		body: { id, address, city, pincode }
	} = req;

	if (!address && !city) {
		const result = await query('update customer set pincode=? where id=?', [pincode, id]);

		if (result.affectedRows)
			return sendSuccess(res, { message: 'Successfully updated profile image!' });

		return sendFailure(res, { message: 'No records found!' });
	} else if (!address && !pincode) {
		const result = await query('update customer set city=? where id=?', [city, id]);

		if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated address!' });

		return sendFailure(res, { message: 'No records found!' });
	} else if (!city && !pincode) {
		const result = await query('update customer set address=? where id=?', [address, id]);

		if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated address!' });

		return sendFailure(res, { message: 'No records found!' });
	} else {
		const result = await query('update customer set address=?, city=? where pincode=?', [
			address,
			city,
			pincode
		]);

		if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated!' });
	}

	return sendFailure(res, { message: 'No records found!' });
};

/**
 * Get a customer
 * @param {id}
 * @returns {customer} | 'No records found'
 */

export const getCustomer = async (req, res) => {
	const {
		params: { id }
	} = req;

	const result = await query('select * from customers where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Customer Login
 * @param {email, phoneNumber, password}
 * @returns 'Logged In' | 'Email or Password incorrect'
 */

export const customerLogin = async (req, res) => {
	const {
		body: { email, phoneNumber, password }
	} = req;

	let result;

	if (email == null && phoneNumber == null) {
		return sendFailure(res, { error: 'Email or Phone Number required' });
	}

	if (email != null) {
		result = await query('select * from customers where email=?', [email]);
	} else {
		result = await query('select * from customers where phoneNumber=?', [phoneNumber]);
	}

	if (!result.length) return sendFailure(res, { error: 'Email or Password incorrect' });

	const match = await bcrypt.compare(password, result[0].password);

	if (!match)
		return sendFailure(res, { error: 'Email or Password incorrect' }, StatusCodes.BAD_REQUEST);

	const { id, name } = result[0];

	const token = generateToken({ role: 'customer', id, name });

	return sendSuccess(res, { message: `You're logged in`, token, name });
};
