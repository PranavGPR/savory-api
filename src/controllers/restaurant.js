import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateToken, sendFailure, sendSuccess } from 'helpers';

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

	return sendSuccess(res, { result });
};
