import Joi from 'joi';

export const createRestaurantValidator = data => {
	const schema = Joi.object({
		name: Joi.string()
			.required()
			.pattern(/^[a-zA-Z]+$/),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		phoneNumber: Joi.string()
			.length(10)
			.pattern(/^[0-9]+$/)
			.required(),
		address: Joi.string().required(),
		city: Joi.string().min(5).max(32).required(),
		pincode: Joi.string()
			.length(6)
			.pattern(/^[0-9]+$/)
			.required(),
		cuisines: Joi.string().required(),
		opening_time: Joi.date().required(),
		closing_time: Joi.date().required(),
		popular_dishes: Joi.string().required(),
		people_say: Joi.string().required(),
		more_info: Joi.string().required()
	});

	return schema.validate(data);
};
