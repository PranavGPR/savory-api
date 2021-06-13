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
