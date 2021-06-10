import Joi from 'joi';

export default function validateCustomer(data) {
	const schema = Joi.object({
		name: Joi.string().required(),
		password: Joi.string().min(8).max(256).required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		phoneNumber: Joi.string()
			.length(10)
			.pattern(/^[0-9]+$/)
			.required(),
		address: Joi.string(),
		city: Joi.string().min(5).max(32),
		pincode: Joi.string()
			.length(6)
			.pattern(/^[0-9]+$/)
	});

	return schema.validate(data);
}
