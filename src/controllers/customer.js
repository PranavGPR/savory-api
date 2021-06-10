import { StatusCodes } from 'http-status-codes';

import { query } from 'helpers/dbConnection';

/**
 * Update a customer
 * @param {id, address, city, pincode}
 * @returns 'Customer Updated' | 'No records found!'
 */

export const updateCustomer = async (req, res) => {
	const {
		body: { id, address, city, pincode }
	} = req;

	if (!uuidValidator(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });

	if (!address && !city) {
		const result = await query('update customer set pincode=? where id=?', [pincode, id]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated profile image!' });

		return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
	} else if (!address && !pincode) {
		const result = await query('update customer set city=? where id=?', [city, id]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated address!' });

		return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
	} else if (!city && !pincode) {
		const result = await query('update customer set address=? where id=?', [address, id]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated address!' });

		return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
	} else {
		const result = await query('update customer set address=?, city=? where pincode=?', [
			address,
			city,
			pincode
		]);

		if (result.affectedRows)
			return res.status(StatusCodes.OK).json({ message: 'Successfully updated!' });
	}

	return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
};
