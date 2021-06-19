import Joi from 'joi';

export const createAdminValidator = data => {
	const schema = Joi.object({
		name: Joi.string().required(),
		password: Joi.string().min(8).max(256).required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required()
	});

	return schema.validate(data);
};

export const updateAdminValidator = data => {
	const schema = Joi.object({
		name: Joi.string().required()
	});

	return schema.validate(data);
};

export const adminLoginValidator = data => {
	const schema = Joi.object({
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		password: Joi.string().min(8).max(256).required()
	});

	return schema.validate(data);
};
