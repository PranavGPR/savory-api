import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { jwtPrivateKey } = process.env;

export const generateBearerToken = (
	role,
	id = '924aee6f-a756-41c6-a546-8d7b01cbe610',
	name = 'test'
) => {
	return 'bearer ' + jwt.sign({ role, id, name }, jwtPrivateKey);
};
