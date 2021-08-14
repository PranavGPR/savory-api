import Joi from 'joi';

export const restaurantLoginValidator = data => {
	const schema = Joi.object({
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		password: Joi.string().min(8).max(256).required()
	});
	return schema.validate(data);
};
