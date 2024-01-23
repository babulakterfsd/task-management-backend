import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TodoControllers } from './todo.controller';
import { todoSchema } from './todo.validation';

const router = express.Router();

router.put('/:id', TodoControllers.updateTodo);

router.delete('/:id', TodoControllers.deleteTodo);

router.get('/:email', TodoControllers.getAllTodosForASpecificUser);

router.post('/', validateRequest(todoSchema), TodoControllers.createTodo);

router.get('/', TodoControllers.getAllTodos);

export const TodoRoutes = router;
