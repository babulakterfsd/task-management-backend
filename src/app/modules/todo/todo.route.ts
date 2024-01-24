import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TodoControllers } from './todo.controller';
import { todoSchema } from './todo.validation';

const router = express.Router();

router.put('/:id', auth('user'), TodoControllers.updateTodo);

router.delete('/:id', auth('admin', 'user'), TodoControllers.deleteTodo);

router.get(
  '/:email',
  auth('user'),
  TodoControllers.getAllTodosForASpecificUser,
);

router.post(
  '/',
  auth('user'),
  validateRequest(todoSchema),
  TodoControllers.createTodo,
);

router.get('/', auth('admin'), TodoControllers.getAllTodos);

export const TodoRoutes = router;
