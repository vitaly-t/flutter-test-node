import { resolveValue } from 'path-value';

export const promifyResolveValue = async (obj, field) => {
	try {
		return resolveValue(obj, field);
	} catch (e) {
		return;
	}
};
