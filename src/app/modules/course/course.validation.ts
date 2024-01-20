import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  instructor: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  categoryId: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  price: z.number({
    invalid_type_error: ' must be number',
    required_error: ' is required',
  }),
  tags: z.array(
    z.object({
      name: z.string({
        invalid_type_error: ' name must be string',
        required_error: ' name is required',
      }),
      isDeleted: z.boolean({
        invalid_type_error: ' isDeleted must be boolean',
        required_error: ' isDeleted is required',
      }),
    }),
  ),
  startDate: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  endDate: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  language: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  provider: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  durationInWeeks: z.number().optional(),
  details: z.object({
    level: z.string({
      invalid_type_error: ' level must be string',
      required_error: ' level is required',
    }),
    description: z.string({
      invalid_type_error: ' description must be string',
      required_error: ' description is required',
    }),
  }),
  createdBy: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
});

export const courseDataToBeUpdatedSchema = z.object({
  title: z.string().optional(),
  instructor: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().optional(),
  tags: z
    .array(
      z.object({
        name: z.string().optional(),
        isDeleted: z.boolean().optional(),
      }),
    )
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  durationInWeeks: z.number().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  details: z
    .object({
      level: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});
