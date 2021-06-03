import express from 'express';
import mysql from 'mysql';
import chalk from 'chalk';
import 'dotenv/config';
import cors from 'cors';

import logger from './tools/logger';
import { registerLogging, registerPreprocessor, registerRouters } from './tools';

const { DB_USER, DB_PASS, DB_URL, PORT } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
registerLogging(app);
registerPreprocessor(app);
registerRouters(app);

const server = app.listen(PORT);

server.once('listening', () => {
	const { port } = server.address();
	logger.info(`Server started at port ${chalk.blueBright(port)}`);
});

const connection = mysql.createConnection({
	host: DB_URL,
	user: DB_USER,
	password: DB_PASS,
	database: 'mydb'
});

connection.connect();

connection.query('SELECT * from student', function (error, results, fields) {
	if (error) throw error;
	logger.info(results);
});

connection.end();
