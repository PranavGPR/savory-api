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
		opening_time: Joi.string()
			.pattern(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/gm)
			.required(),
		closing_time: Joi.string()
			.pattern(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/gm)
			.required(),
		popular_dishes: Joi.string().required(),
		people_say: Joi.string().required(),
		more_info: Joi.string().required()
	});

	return schema.validate(data);
};

export const updateRestaurantValidator = data => {
	const schema = Joi.object({
		name: Joi.string(),
		phoneNumber: Joi.string(),
		address: Joi.string(),
		city: Joi.string().min(5).max(32),
		pincode: Joi.string()
			.length(6)
			.pattern(/^[0-9]+$/),
		cuisines: Joi.string(),
		opening_time: Joi.string().pattern(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/gm),
		closing_time: Joi.string().pattern(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/gm),
		popular_dishes: Joi.string(),
		people_say: Joi.string(),
		more_info: Joi.string()
	});

	return schema.validate(data);
};
