import Joi from 'joi';

export const updateOrderSchema = Joi.object({
	status: Joi.string(),
	payment_mode: Joi.string(),
	delivered_on: Joi.date()
});

export const updateOrderValidator = data => {
	return updateOrderSchema.validate(data);
};
