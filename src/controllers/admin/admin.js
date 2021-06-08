import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { uuidValidator, validateAdmin } from 'validators';

/**
 * Controllers for all /admin routes
 *
 * Available controllers: createAdmin, getAdmins, getAdminByID, deleteAdmin
 */

/**
 * Create an admin
 * @param { name, password, profileImg, email }
 * @returns 'Successfully Inserted' | 'Error in inserting the values'
 */
export const createAdmin = async (req, res) => {
	const { body } = req;
	const id = uuidv4();

	const { error } = validateAdmin(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	const { name, password, profileImg, email } = body;

	const result = await query('insert into admin values(?,?,?,?,?)', [
		id,
		name,
		password,
		email,
		profileImg
	]);

	if (result.affectedRows)
		return res.status(StatusCodes.OK).json({ message: 'Successfully inserted!' });

	return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Error in inserting the values' });
};

/**
 * Get all admins
 * @param {}
 * @returns [admins] | 'No records found!'
 */
export const getAdmins = async (req, res) => {
	const result = await query('select * from admin');

	if (!result) return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });

	return res.status(StatusCodes.OK).json({ result: result });
};

/**
 * Get an admin by ID
 * @param {id}
 * @returns {admin} | 'No records found!'
 */
export const getAdminById = async (req, res) => {
	const { id } = req.params;

	if (!uuidValidator(id)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });
	}

	const result = await query('select * from admin where id=?', [id]);

	if (!result) return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });

	return res.status(StatusCodes.OK).json({ result: result[0] });
};

/**
 * Delete an admin
 * @param {id}
 * @returns 'Admin Deleted' | 'No records found!'
 */

export const deleteAdmin = async (req, res) => {
	const { id } = req.params;

	if (!uuidValidator(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });

	const result = await query('delete from admin where id=?', [id]);

	if (result.affectedRows)
		return res.status(StatusCodes.OK).json({ message: 'Successfully deleted!' });

	return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
};

/**
 * Update an admin
 * @param {id, name, profileImg}
 * @returns 'Admin Deleted' | 'No records found!'
 */

export const updateAdmin = async (req, res) => {
	const {
		body: { id, name, profileImg }
	} = req;

	if (!uuidValidator(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });

	if (!name) {
		const result = await query('update admin set profileImg=? where id=?', [profileImg, id]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated profile image!' });
	} else if (!profileImg) {
		const result = await query('update admin set name=? where id=?', [name, id]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated name!' });
	} else {
		const result = await query('update admin set name=?, profileImg=? where id=?', [
			name,
			profileImg,
			id
		]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated!' });
	}

	return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
};
