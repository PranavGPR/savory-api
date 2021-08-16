export default {
	'/': {
		get: {
			tags: ['ping'],
			summary: 'Ping the server',
			description: 'Ping the server',
			responses: {
				200: {
					description: 'Ping successful'
				}
			}
		}
	}
};
