import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string(),
  createdBy: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
});
