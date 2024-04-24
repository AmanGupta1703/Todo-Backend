import { AppError } from './../utils/appError.js';

// Error handling for development environment
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

// Error handling for production environment
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error('ERROR 💥', err);

		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
};

// Error handling for invalid database ID
const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value[`${err.path}`]}.`;
	return new AppError(message, 400);
};

// Error handling for duplicate fields in database
const handleDuplicateFieldsDB = err => {
	const value = err.keyValue.name;
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

// Error handling for validation errors
const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = Object.create(err);

		// Error handling for invalid database ID
		if (error.name === 'CastError') {
			error = handleCastErrorDB(error);
		}

		// Error handling for duplicate fields in database
		if (error.code === 11000) {
			error = handleDuplicateFieldsDB(error);
		}

		// Error handling for validation errors
		if (error.name === 'ValidationError') {
			error = handleValidationErrorDB(error);
		}

		sendErrorProd(error, res);
	}
};

export { globalErrorHandler };
