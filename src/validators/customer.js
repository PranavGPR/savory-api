import Joi from 'joi';

export const customerLoginValidator = data => {
	const schema = Joi.object({
		email: Joi.string().email({ tlds: { allow: false } }),
		phoneNumber: Joi.number().min(5555555555).max(9999999999),
		password: Joi.string().min(8).max(256).required()
	});

	return schema.validate(data);
};

export const createOrderValidator = data => {
	const schema = Joi.object({
		customerid: Joi.string().required(),
		restaurantid: Joi.string().required(),
		status: Joi.string().required(),
		delivered_on: Joi.string()
			.pattern(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/)
			.required(),
		ordered_item: Joi.string().required(),
		amount: Joi.number().required(),
		payment_mode: Joi.string().required()
	});

	return schema.validate(data);
};
