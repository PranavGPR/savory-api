export const restaurantValues = {
	id: 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
	menuid: '77e39eec-a0a4-4efc-a971-bf0a8427aa88',
	name: 'A2D Restaurant',
	phoneNumber: '9750844039',
	email: 'restaurant1@email.com',
	address: '4/1252, Street',
	city: 'Madurai',
	pincode: '625020',
	cuisines: JSON.stringify(['Chinese', 'North Indian', 'South Indian']),
	opening_time: '2021-08-15 08:00:00',
	closing_time: '2021-08-15 20:00:00',
	popular_dishes: JSON.stringify(['Tikka Gravy', 'Paneer Masala']),
	people_say: JSON.stringify(['Good Service']),
	more_info: JSON.stringify(['Valet Parking']),
	password: '$2b$10$vTkWCMemROvuX639knNLvONS92BAOLaIx76W9GspYkrNISyztqLDy'
};

export const orderValues = {
	customerid: '9629ea6a-2854-4f5c-8501-a67e343837dd',
	restaurantid: 'ecd6fdb7-2174-4b8c-9f36-cfc7982d866d',
	status: 'delivered',
	delivered_on: '08:00:00',
	ordered_item: JSON.stringify([
		{ name: 'Idly', quantity: '4' },
		{ name: 'Dosa', quantity: '1' }
	]),
	amount: 200,
	payment_mode: 'COD'
};

export const customerValues = {
	id: '9629ea6a-2854-4f5c-8501-a67e343837dd',
	name: 'Pranav',
	phoneNumber: '9750844039',
	email: 'pranav@email.com',
	password: '$2b$10$vTkWCMemROvuX639knNLvONS92BAOLaIx76W9GspYkrNISyztqLDy'
};
