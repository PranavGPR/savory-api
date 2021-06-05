import { StatusCodes } from 'http-status-codes';

import connection from 'helpers/dbConnection';

/**
 * Controllers for all /ping routes
 *
 * Available controllers: basePing
 */

export function basePing(_req, res) {
	/**
	 * Ping the server
	 * @param {}
	 * @returns Status `200`
	 */

	connection.query('SELECT * from student', function (error, results, fields) {
		if (error) throw error;
		res.status(StatusCodes.OK).json({ message: results });
	});

	connection.end();
}

export default { basePing };
