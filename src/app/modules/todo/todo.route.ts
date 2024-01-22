import express from 'express';
import { TodoControllers } from './todo.controller';

const router = express.Router();

router.put('/:id', TodoControllers.updateTodo);

router.delete('/:id', TodoControllers.deleteTodo);

router.post('/', TodoControllers.createTodo);

router.get('/', TodoControllers.getAllTodos);

export const TodoRoutes = router;
