import { z } from 'zod';

export const reviewSchema = z.object({
  courseId: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  rating: z
    .number()
    .refine(
      (value) => Number.isInteger(value) && [1, 2, 3, 4, 5].includes(value),
      {
        message:
          ' must be an integer between 1, 2, 3, 4, or 5, and no fraction allowed',
      },
    ),

  review: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),

  createdBy: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
});
