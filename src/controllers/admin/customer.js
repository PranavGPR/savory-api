import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { query } from 'helpers/dbConnection';
import { uuidValidator, validateCustomer } from 'validators';

/**
 * Controllers for all /admin/customer routes
 *
 * Available controllers: createCustomer, getAllCustomer, getCustomer, deleteCustomer
 */

/**
 * Create a customer
 * @param { name, password, email, phoneNumber, address, city, pincode }
 * @returns 'Successfully Inserted' | 'Error in inserting the values'
 */

export const createCustomer = async (req, res) => {
	const { body } = req;
	const id = uuidv4();

	const { error } = validateCustomer(body);
	if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

	const { name, password, phoneNumber, email, address, city, pincode } = body;

	const result = await query(
		'insert into customer(id,name,phoneNumber,email,password,address,city,pincode) values(?,?,?,?,?,?,?,?)',
		[id, name, phoneNumber, email, password, address, city, pincode]
	);

	if (result.affectedRows)
		return res.status(StatusCodes.OK).json({ message: 'Successfully inserted!' });

	return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Error in inserting the values' });
};

/**
 * Get all customers
 * @param {}
 * @returns [customers] | 'No records found!'
 */
export const getCustomers = async (req, res) => {
	const result = await query('select * from customer');

	if (!result) return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });

	return res.status(StatusCodes.OK).json({ result: result });
};

/**
 * Get a customer by ID
 * @param {id}
 * @returns [customer] | 'No records found!'
 */
export const getCustomerById = async (req, res) => {
	const { id } = req.params;

	if (!uuidValidator(id)) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });
	}

	const result = await query('select * from customer where id=?', [id]);

	if (!result) return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });

	return res.status(StatusCodes.OK).json({ result: result[0] });
};

/**
 * Delete a customer
 * @param {id}
 * @returns 'Customer Deleted' | 'No records found!'
 */

export const deleteCustomer = async (req, res) => {
	const { id } = req.params;

	if (!uuidValidator(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });

	const result = await query('delete from customer where id=?', [id]);

	if (result.affectedRows)
		return res.status(StatusCodes.OK).json({ message: 'Successfully deleted!' });

	return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
};

/**
 * Update a customer
 * @param {id, name, phoneNumber, address, city, pincode}
 * @returns 'Customer Updated' | 'No records found!'
 */

export const updateCustomer = async (req, res) => {
	const { id } = req.params;
	const { body } = req;

	if (!uuidValidator(id))
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });

	let fields = '';
	Object.keys(body).forEach((val, ind) => {
		fields += ind + 1 === Object.keys(body).length ? `${val}=?` : `${val}=?,`;
	});

	let objValues = Object.values(body);
	objValues.push(id);

	const result = await query(`update customer set ${fields} where id=?`, objValues);

	if (result.affectedRows)
		return res.status(StatusCodes.OK).json({ message: 'Successfully updated' });

	return res.status(StatusCodes.NOT_FOUND).json({ message: 'No records found!' });
};
