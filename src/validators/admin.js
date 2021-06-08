import Joi from 'joi';

export default function validateAdmin(data) {
	const schema = Joi.object({
		name: Joi.string().required(),
		password: Joi.string().min(8).max(256).required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		profileImg: Joi.string().required()
	});

	return schema.validate(data);
}
