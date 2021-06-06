import Joi from 'joi';

export const validateAdmin = data => {
	const schema = Joi.object({
		id: Joi.string().required(),
		name: Joi.string().required(),
		password: Joi.string().min(8).max(256).required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		profileImg: Joi.string().required()
	});

	return schema.validate(data);
};
