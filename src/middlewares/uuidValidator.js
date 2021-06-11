import { StatusCodes } from 'http-status-codes';

export default function uuidValidator(req, res, next) {
	const { id } = req.params;

	const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	const result = uuidPattern.test(id);

	if (!result) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Enter a valid id' });
	}

	next();
}
