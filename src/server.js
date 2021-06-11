import express from 'express';
import 'express-async-errors';
import chalk from 'chalk';
import 'dotenv/config';
import cors from 'cors';

import logger from 'tools/logger';
import { registerLogging, registerPreprocessor, registerRouters } from 'tools';

const { PORT, NODE_ENV } = process.env;

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
	logger.info(`Environment: ${NODE_ENV}`);
});

module.exports = server;
