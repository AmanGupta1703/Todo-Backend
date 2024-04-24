import dotenv from 'dotenv';

process.on('uncaughtException', err => {
	console.log(err.name, err.message);
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	process.exit(1);
});

dotenv.config({ path: './.env' });

import { app } from './app.js';
import { connectDB } from './db/index.js';

connectDB();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});
