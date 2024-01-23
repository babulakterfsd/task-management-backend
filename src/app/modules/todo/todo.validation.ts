import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string(),
  title: z
    .string({
      invalid_type_error: 'Title must be a string',
      required_error: 'Title is required',
    })
    .min(3)
    .max(8),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
      required_error: 'Description is required',
    })
    .min(9)
    .max(20),
  isCompleted: z.boolean(),
  createdBy: z
    .string({
      invalid_type_error: 'Created by must be a string',
      required_error: 'Created by is required',
    })
    .min(5),
});
