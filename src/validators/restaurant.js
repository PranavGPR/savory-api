import Joi from 'joi';

export const restaurantLoginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	password: Joi.string().min(8).max(256).required()
});

export const restaurantLoginValidator = data => {
	return restaurantLoginSchema.validate(data);
};
