import { Router } from 'express';

import {
	getTodos,
	getTodo,
	createTodo,
	deleteTodo,
	updateTodo,
	getTodoStats,
} from './../controllers/todo.controller.js';

const router = Router();

router.route('/stats').get(getTodoStats);

router.route('/').get(getTodos).post(createTodo);

router.route('/:id').get(getTodo).patch(updateTodo).delete(deleteTodo);

export default router;
