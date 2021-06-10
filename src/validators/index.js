export { default as validateAdmin } from './admin';
export { default as validateCustomer } from './customer';

export const uuidValidator = uuid => {
	const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidPattern.test(uuid);
};
