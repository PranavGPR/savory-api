import Joi from 'joi';

export const customerLoginSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }),
	phoneNumber: Joi.number().min(5555555555).max(9999999999),
	password: Joi.string().min(8).max(256).required()
});

export const customerLoginValidator = data => {
	return customerLoginSchema.validate(data);
};

export const createOrderSchema = Joi.object({
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

export const createOrderValidator = data => {
	return createOrderSchema.validate(data);
};
