export const customerLoginExample = {
	email: 'pranav@email.com',
	password: '12345678'
};

export const createOrderExample = {
	customerid: '9629ea6a-2854-4f5c-8501-a67e343837dd',
	restaurantid: 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
	status: 'delivered',
	delivered_on: '2021-06-13 08:00:00',
	ordered_item: JSON.stringify([
		{ name: 'Idly', quantity: '4' },
		{ name: 'Dosa', quantity: '1' }
	]),
	amount: 200,
	payment_mode: 'COD'
};
