import { Schema, model } from 'mongoose';
import { TTodo } from './todo.interface';

const todoSchema = new Schema<TTodo>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      minlength: 3,
      maxlength: 8,
      required: true,
    },
    description: {
      type: String,
      minlength: 9,
      maxlength: 20,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const TodoModel = model('todos', todoSchema);
