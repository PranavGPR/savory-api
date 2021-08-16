import { query } from 'helpers/dbConnection';
import { sendFailure, sendSuccess } from 'helpers';

/**
 * Controllers for all /ping routes
 *
 * Available controllers: basePing
 */

export async function basePing(_req, res) {
	/**
	 * Ping the server
	 * @param {}
	 * @returns Status `200`
	 */

	const result = await query('SELECT * from customers');

	if (!result.length) return sendFailure(res, { error: 'No records found' });

	return sendSuccess(res, { result });
}

export default { basePing };
