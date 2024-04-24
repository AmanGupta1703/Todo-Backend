import { Todo } from '../models/tour.model.js';
import ApiFeatures from './../utils/ApiFeatures.js';
import { AppError } from './../utils/appError.js';
import { catchAsync } from './../utils/catchAsync.js';

const getTodos = catchAsync(async (req, res, next) => {
	const features = new ApiFeatures(Todo.find(), req.query)
		.sort()
		.filter()
		.limitFields()
		.paginate();

	const todos = await features.query;

	if (!todos.length) {
		return next(new AppError('No todos found', 404));
	}

	if (req.query.page) {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 100;
		const totalDocuments = await Todo.countDocuments();
		const totalPages = Math.ceil(totalDocuments / limit);

		return res.status(200).json({
			status: 'success',
			resultsLength: todos.length,
			page,
			totalPages,
			data: { todos },
		});
	}

	res.status(200).json({
		status: 'success',
		resultsLength: todos.length,
		data: { todos },
	});
});

const getTodo = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const todo = await Todo.findById({ _id: id }).select('-__v');

	if (!todo) {
		return next(new AppError('Todo not found', 404));
	}

	res.status(200).json({ status: 'success', data: { todo } });
});

const createTodo = catchAsync(async (req, res, next) => {
	const { name } = req.body;

	if (!name) {
		return next(new AppError('Name is required', 400));
	}

	const todo = await Todo.create({ name });

	if (!todo) {
		return next(new AppError('Failed to create todo', 500));
	}

	res.status(201).json({
		status: 'success',
		data: { todo },
		message: 'Todo created successfully',
	});
});

const deleteTodo = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const todo = await Todo.findByIdAndDelete({ _id: id }).select('-__v');

	if (!todo) {
		return next(new AppError('Todo not found', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
		message: 'Deleted successfully',
	});
});

const updateTodo = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const todo = await Todo.findByIdAndUpdate({ _id: id }, req.body, {
		new: true,
	}).select('-__v');

	if (!todo) {
		return next(new AppError('Todo not found', 404));
	}

	try {
		res.status(200).json({
			status: 'success',
			data: { todo },
			message: 'Todo updated successfully',
		});
	} catch (error) {
		res.status(500).json({ status: 'fail', message: error.message });
	}
});

const getTodoStats = catchAsync(async (req, res, next) => {
	const stats = await Todo.aggregate([
		{
			$group: {
				numTodos: { $sum: 1 },
				_id: '$completed',
			},
		},
		{
			$addFields: {
				name: {
					$cond: {
						if: { $eq: ['$_id', true] },
						then: 'Completed',
						else: 'Not Completed',
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
	]);

	res.status(200).json({ status: 'success', data: { stats } });
});

export { getTodos, getTodo, createTodo, deleteTodo, updateTodo, getTodoStats };

// const getTodos = async (req, res) => {
// 	try {
// 		const queryObj = { ...req.query };
// 		const excludedFields = ['page', 'sort', 'limit', 'fields'];

// 		excludedFields.forEach(el => delete queryObj[el]);

// 		let query = Todo.find(queryObj);

// 		if (req.query.sort) {
// 			const sortBy = req.query.sort.split(',').join(' ');
// 			console.log(sortBy);
// 			query = query.sort(sortBy);
// 		} else {
// 			query = query.sort('-createdAt');
// 		}

// 		if (req.query.fields) {
// 			const fields = req.query.fields.split(',').join(' ');
// 			query = query.select(fields);
// 		} else {
// 			query = query.select('-__v');
// 		}

// 		const page = Number(req.query.page) || 1;
// 		const limit = Number(req.query.limit) || 100;
// 		const skip = (page - 1) * limit;
// 		const totalDocuments = await Todo.countDocuments();
// 		const totalPages = Math.ceil(totalDocuments / limit);

// 		if (req.query.page) {
// 			query = query.skip(skip).limit(limit);
// 		}

// 		const features = new ApiFeatures(Todo.find(), req.query)
// 			.sort()
// 			.filter()
// 			.limitFields()
// 			.paginate();

// 		const todos = await features.query;

// 		res.status(200).json({
// 			status: 'success',
// 			resultsLength: todos.length,
// 			// totalPages,
// 			page,
// 			data: { todos },
// 		});
// 	} catch (error) {
// 		res.status(500).json({ status: 'fail', message: 'Failed to fetched data' });
// 	}
// // };
