import { query } from 'helpers/dbConnection';
import { sendFailure, sendSuccess } from 'helpers';

/**
 * Controllers for all /admin/order routes
 *
 * Available controllers: createRestaurant, getAllRestaurants, getRestaurant, deleteRestaurant, updateRestaurant
 */

/**
 * Get all orders
 * @param {}
 * @returns [orders] | 'No records found'
 */
export const getOrders = async (req, res) => {
	const result = await query('select * from orders');

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Get a order by ID
 * @param {id}
 * @returns {order} | 'No records found'
 */
export const getOrderById = async (req, res) => {
	const { id } = req.params;

	const result = await query('select * from orders where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Delete an order
 * @param {id}
 * @returns 'order Deleted' | 'No records found'
 */

export const deleteOrder = async (req, res) => {
	const { id } = req.params;

	const result = await query('delete from orders where id=?', [id]);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully deleted' });

	return sendFailure(res, { error: 'No records found' });
};

/**
 * Update an order
 * @param {id }
 * @returns 'order Updated' | 'No records found'
 */

export const updateOrder = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	let fields = '';
	Object.keys(body).forEach((val, ind) => {
		fields += ind + 1 === Object.keys(body).length ? `${val}=?` : `${val}=?,`;
	});

	let objValues = Object.values(body);
	objValues.push(id);

	const result = await query(`update orders set ${fields} where id=?`, objValues);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated' });

	return sendFailure(res, { error: 'No records found' });
};
