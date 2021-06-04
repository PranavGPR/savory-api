import mysql from 'mysql';
import 'dotenv/config';

const { DB_USER, DB_PASS, DB_URL, DB_NAME } = process.env;

const connection = mysql.createConnection({
	host: DB_URL,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME
});

connection.connect();

export default connection;
