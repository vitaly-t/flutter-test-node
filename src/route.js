import { Router } from 'express';
import { promifyResolveValue } from './helper';
import { validationSchema } from './validation';
const router = new Router();

router.get('/', function (req, res) {
	try {
		return res.status(200).json({
			message: 'My Rule-Validation API',
			status: 'success',
			data: {
				name: 'Joshua Oluikpe',
				github: '@dagenius007',
				email: 'joshuaoluikpe@gmail.com',
				mobile: '07054205880',
			},
		});
	} catch (e) {
		return res.status(500).json({ message: 'An error occured', status: 'error', data: null });
	}
});

router.post('/validate-rule', async function (req, res) {
	const validator = validationSchema.validate(req.body, { abortEarly: true });

	if (validator.error) {
		const message = validator.error.details.map((i) => i.message);
		return res.status(400).json({ message: message[0], status: 'error', data: null });
	}

	try {
		const {
			data,
			rule: { field, condition, condition_value },
		} = req.body;

		let isValid = false;

		let value;

		//check if data type is string
		if (typeof data === 'string') {
			value = data[field];
		} else {
			//replace braces with dot for cases like array nested in objects
			const formattedField = field.replace(/\[(\w+)\]/g, '.$1');
			value = await promifyResolveValue(data, field);
		}

		//check if data exist
		if (value === undefined || value === null) {
			return res.status(400).json({
				message: `field ${field} is missing from data.`,
				status: 'error',
				data: null,
			});
		}

		//Compare rules based on conditons
		if (condition === 'eq') {
			isValid = value === condition_value;
		}
		if (condition === 'neq') {
			isValid = value !== condition_value;
		}
		if (condition === 'gt') {
			isValid = value > condition_value;
		}
		if (condition === 'gte') {
			isValid = value >= condition_value;
		}
		if (condition === 'contains') {
			isValid = value.includes(condition_value);
		}

		if (isValid) {
			res.status(200).json({
				message: `field ${field} successfully validated.`,
				status: 'success',
				data: {
					validation: {
						error: false,
						field,
						field_value: value,
						condition,
						condition_value,
					},
				},
			});
		} else {
			res.status(400).json({
				message: `field ${field} failed validation.`,
				status: 'error',
				data: {
					validation: {
						error: true,
						field,
						field_value: value,
						condition,
						condition_value,
					},
				},
			});
		}
	} catch (e) {
		return res.status(500).json({ message: 'An error occured', status: 'error', data: null });
	}
});

export default router;
