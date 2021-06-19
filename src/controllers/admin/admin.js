import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { generateToken, sendFailure, sendSuccess } from 'helpers';

/**
 * Controllers for all /admin routes
 *
 * Available controllers: createAdmin, getAdmins, getAdminByID, deleteAdmin, updateAdmin
 */

/**
 * Create an admin
 * @param { name, password, email }
 * @returns 'Successfully Inserted' | 'Error in inserting the values'
 */
export const createAdmin = async (req, res) => {
	const {
		body: { name, password, email }
	} = req;

	const id = uuidv4();

	const result = await query('insert into admins(id,name,password,email) values(?,?,?,?)', [
		id,
		name,
		password,
		email
	]);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully inserted' });

	return sendFailure(res, { error: 'Error in inserting the values' }, StatusCodes.BAD_REQUEST);
};

/**
 * Get all admins
 * @param {}
 * @returns [admins] | 'No records found'
 */
export const getAdmins = async (req, res) => {
	const result = await query('select * from admins');

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
};

/**
 * Get an admin by ID
 * @param {id}
 * @returns {admin} | 'No records found'
 */
export const getAdminById = async (req, res) => {
	const { id } = req.params;

	const result = await query('select * from admins where id=?', [id]);

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result: result[0] });
};

/**
 * Delete an admin
 * @param {id}
 * @returns 'Admin Deleted' | 'No records found'
 */

export const deleteAdmin = async (req, res) => {
	const { id } = req.params;

	const result = await query('delete from admins where id=?', [id]);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully deleted' });

	return sendFailure(res, { error: 'No records found' });
};

/**
 * Update an admin
 * @param {id, name, password, email}
 * @returns 'Admin Updated' | 'No records found'
 */

export const updateAdmin = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	let fields = '';
	Object.keys(body).forEach((val, ind) => {
		fields += ind + 1 === Object.keys(body).length ? `${val}=?` : `${val}=?,`;
	});

	let objValues = Object.values(body);
	objValues.push(id);

	const result = await query(`update admins set ${fields} where id=?`, objValues);

	if (result.affectedRows) return sendSuccess(res, { message: 'Successfully updated' });

	return sendFailure(res, { error: 'No records found' });
};

/**
 *
 * Admin Login
 *
 * @route: /login
 * @method: POST
 * @requires: body{ email, password}
 * @returns: 'Logged in Successfully' | 'Could not login'
 *
 */

export const adminLogin = async (req, res) => {
	const {
		body: { email, password }
	} = req;

	const result = await query('select * from admins where email=?', [email]);

	if (!result.length) return sendFailure(res, { error: 'Email or Password incorrect' });

	const { id, name } = result[0];

	const token = generateToken({ role: 'admin', id, name });

	return sendSuccess(res, { message: `You're logged in`, token, name });
};
