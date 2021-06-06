import { StatusCodes } from 'http-status-codes';

import { query } from 'helpers/dbConnection';
import { validateAdmin } from 'validators/admin';

export const createAdmin = async (req, res) => {
	const { body } = req;

	const { error } = validateAdmin(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	const { id, name, password, profileImg, email } = body;

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
