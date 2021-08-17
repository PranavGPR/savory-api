import Joi from 'joi';

export const createCustomerSchema = Joi.object({
	name: Joi.string().required(),
	password: Joi.string().min(8).max(256).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	phoneNumber: Joi.string()
		.length(10)
		.pattern(/^[0-9]+$/)
		.required(),
	address: Joi.string().empty('').default(null),
	city: Joi.string().min(5).max(32).empty('').default(null),
	pincode: Joi.string()
		.length(6)
		.pattern(/^[0-9]+$/)
		.empty('')
		.default(null)
});

export const createCustomerValidator = data => {
	return createCustomerSchema.validate(data);
};

export const updateCustomerSchema = Joi.object({
	name: Joi.string(),
	phoneNumber: Joi.string()
		.length(10)
		.pattern(/^[0-9]+$/),
	address: Joi.string(),
	city: Joi.string().min(5).max(32),
	pincode: Joi.string()
		.length(6)
		.pattern(/^[0-9]+$/)
});

export const updateCustomerValidator = data => {
	return updateCustomerSchema.validate(data);
};
