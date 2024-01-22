import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TodoServices } from './todo.service';

// create todo
const createTodo = catchAsync(async (req, res) => {
  const result = await TodoServices.createTodoInDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Todo has been created succesfully',
    data: result,
  });
});

// get all todos
const getAllTodos: RequestHandler = catchAsync(async (req, res) => {
  const result = await TodoServices.getAllTodosFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Todos have been retrieved succesfully',
    data: result,
  });
});

//update a todo
const updateTodo: RequestHandler = catchAsync(async (req, res) => {
  const result = await TodoServices.updateTodoInDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Todo has been updated succesfully',
    data: result,
  });
});

// delete a todo
const deleteTodo: RequestHandler = catchAsync(async (req, res) => {
  const result = await TodoServices.deleteTodoFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Todo has been deleted succesfully',
    data: result,
  });
});

export const TodoControllers = {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
};
