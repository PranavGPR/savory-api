import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { sendFailure, sendSuccess } from 'helpers';
import logger from 'tools/logger';

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

/**
 * Get a restaurant by ID
 * @param {id}
 * @returns {restaurant} | 'No records found'
 */
export const getRestaurantById = async (req, res) => {
	const { id } = req.params;

	const result = await query('select * from restaurant where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Delete an restaurant
 * @param {id}
 * @returns 'Restaurant Deleted' | 'No records found'
 */

export const deleteRestaurant = async (req, res) => {
	const { id } = req.params;

	const result = await query('delete from restaurant where id=?', [id]);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully deleted' });

	return sendFailure(res, { error: 'No records found' });
};

/**
 * Update a restaurant
 * @param {id, name, phoneNumber, address, city, pincode, cuisines, opening_time, closing_time, popular_dishes, people_say, more_info}
 * @returns 'Restaurant Updated' | 'No records found'
 */

export const updateRestaurant = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	logger.info(id);
	logger.info(body);

	let fields = '';
	Object.keys(body).forEach((val, ind) => {
		fields += ind + 1 === Object.keys(body).length ? `${val}=?` : `${val}=?,`;
	});

	let objValues = Object.values(body);
	objValues.push(id);

	const result = await query(`update restaurant set ${fields} where id=?`, objValues);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated' });

	return sendFailure(res, { error: 'No records found' });
};
