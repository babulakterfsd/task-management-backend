import { TTodo } from './todo.interface';
import { TodoModel } from './todo.model';

//create todo in db
const createTodoInDB = async (requestBody: TTodo) => {
  const result = await TodoModel.create(requestBody);
  if (!result) {
    throw new Error('Failed to create todo');
  } else {
    return result;
  }
};

// get all todos from db
const getAllTodosFromDB = async () => {
  const result = await TodoModel.find();
  if (!result) {
    throw new Error('Failed to get all todos');
  } else {
    return result;
  }
};

//update a todo in db
const updateTodoInDB = async (id: string, requestBody: TTodo) => {
  const todoToBeUpdated = await TodoModel.findOne({ id: id });

  if (!todoToBeUpdated) {
    throw new Error('Todo not found');
  } else {
    const result = await TodoModel.findOneAndUpdate(
      { id: id },
      { $set: requestBody },
      { new: true },
    );

    if (!result) {
      throw new Error('Failed to update todo');
    }
    return result;
  }
};

// delete a todo from db
const deleteTodoFromDB = async (id: string) => {
  const result = await TodoModel.findOneAndDelete({ id: id });
  if (!result) {
    throw new Error('Failed to delete todo');
  }
  return result;
};

export const TodoServices = {
  createTodoInDB,
  getAllTodosFromDB,
  updateTodoInDB,
  deleteTodoFromDB,
};
