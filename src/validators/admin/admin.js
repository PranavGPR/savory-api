import Joi from 'joi';

export const createAdminSchema = Joi.object({
	name: Joi.string().required(),
	password: Joi.string().min(8).max(256).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
});

export const createAdminValidator = data => {
	return createAdminSchema.validate(data);
};

export const updateAdminSchema = Joi.object({
	name: Joi.string().required()
});

export const updateAdminValidator = data => {
	return updateAdminSchema.validate(data);
};

export const updateAdminPasswordSchema = Joi.object({
	currentPassword: Joi.string().required(),
	newPassword: Joi.string().required()
});

export const updateAdminPasswordValidator = data => {
	return updateAdminPasswordSchema.validate(data);
};

export const adminLoginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	password: Joi.string().min(8).max(256).required()
});

export const adminLoginValidator = data => {
	return adminLoginSchema.validate(data);
};
