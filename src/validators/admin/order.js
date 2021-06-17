import Joi from 'joi';

export const updateOrderValidator = data => {
	const schema = Joi.object({
		status: Joi.string(),
		payment_mode: Joi.string(),
		delivered_on: Joi.date()
	});

	return schema.validate(data);
};
