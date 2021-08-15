import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateToken, sendFailure, sendSuccess } from 'helpers';

/**
 * New orders
 * @param {id}
 * @returns [orders] | 'No records found'
 */

export const newOrders = async (req, res) => {
	const {
		params: { id }
	} = req;

	const result = await query('select * from orders where restaurantid=? and status="ordered"', [
		id
	]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Get a restaurant
 * @param {id}
 * @returns {restaurant} | 'No records found'
 */

export const getRestaurant = async (req, res) => {
	const {
		params: { id }
	} = req;

	const result = await query('select * from restaurants where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Get a restaurant's order history
 * @param {id}
 * @returns [orders] | 'No records found'
 */

export const getRestaurantOrders = async (req, res) => {
	const {
		params: { id }
	} = req;

	const result = await query('select * from orders where restaurantid=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Restaurant Login
 * @param {email, password}
 * @returns 'Logged In' | 'Email or Password incorrect'
 */

export const restaurantLogin = async (req, res) => {
	const {
		body: { email, password }
	} = req;

	if (email == null || password == null) {
		return sendFailure(res, { error: 'Email or password required' });
	}

	const result = await query('select * from restaurants where email=?', [email]);

	if (!result.length) return sendFailure(res, { error: 'Email or Password incorrect' });

	const match = await bcrypt.compare(password, result[0].password);

	if (!match)
		return sendFailure(res, { error: 'Email or Password incorrect' }, StatusCodes.BAD_REQUEST);

	const { id, name } = result[0];

	const token = generateToken({ role: 'restaurant', id, name });

	return sendSuccess(res, { message: `You're logged in`, token, name });
};
