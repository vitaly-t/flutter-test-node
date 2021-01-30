import Joi from 'joi';

//Validation rule schema
export const validationSchema = Joi.object({
	rule: Joi.object({
		field: Joi.string().required(),
		condition: Joi.string().valid('eq', 'neq', 'gt', 'gte', 'contains').required(),
		condition_value: [Joi.number().required(), Joi.string().required()],
	}).required(),
	data: [Joi.array().required(), Joi.string().required(), Joi.object({}).unknown()],
});
