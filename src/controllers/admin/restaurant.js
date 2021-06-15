import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { sendFailure, sendSuccess } from 'helpers';

/**
 * Controllers for all /admin/restaurant routes
 *
 * Available controllers: createRestaurant, getAllRestaurants, getRestaurant, deleteRestaurant, updateRestaurant
 */

/**
 * Create a customer
 * @param { name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say }
 * @returns 'Successfully Inserted' | 'Error in inserting the values'
 */
export const createRestaurant = async (req, res) => {
	const { body } = req;
	const id = uuidv4();

	const {
		name,
		phoneNumber,
		email,
		address,
		city,
		pincode,
		cuisines,
		opening_time,
		closing_time,
		popular_dishes,
		people_say,
		more_info
	} = body;

	const result = await query(
		`insert into restaurant(id,menuid,name,phoneNumber,email,address,city,pincode,cuisines,opening_time,closing_time,popular_dishes,people_say,more_info) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
		[
			id,
			'77e39eec-a0a4-4efc-a971-bf0a8427aa88',
			name,
			phoneNumber,
			email,
			address,
			city,
			pincode,
			JSON.stringify(cuisines),
			opening_time,
			closing_time,
			JSON.stringify(popular_dishes),
			JSON.stringify(people_say),
			JSON.stringify(more_info)
		]
	);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully inserted' });

	return sendFailure(res, { error: 'Error in inserting the values' }, StatusCodes.BAD_REQUEST);
};

/**
 * Get all restaurants
 * @param {}
 * @returns [restaurants] | 'No records found'
 */
export const getRestaurants = async (req, res) => {
	const result = await query('select * from restaurant');

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};
