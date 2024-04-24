import mongoose from 'mongoose';

import { DB_NAME } from '../constants.js';

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/${DB_NAME}`
		);
		if (!connectionInstance) {
			throw new Error('MongoDB Connection :: Error');
		}
		console.log(
			'MongoDB Connection Instance: ',
			connectionInstance.connection.host
		);
	} catch (error) {
		console.log('MongoDB Connection :: Error', error);
	}
};

export { connectDB };
