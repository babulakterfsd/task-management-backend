import { z } from 'zod';

export const userSchema = z.object({
  username: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  email: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  role: z.enum(['user', 'admin'], {
    invalid_type_error: ' must be either "user" or "admin"',
    required_error: ' is required',
  }),
  lastTwoPasswords: z
    .array(
      z
        .object({
          oldPassword: z
            .string({
              invalid_type_error: ' must be string',
              required_error: ' is required',
            })
            .optional(),
          changedAt: z
            .date({
              invalid_type_error: ' must be a valid date',
              required_error: ' is required',
            })
            .optional(),
        })
        .optional(),
    )
    .optional(),
});

export const loginSchema = z.object({
  username: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  password: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  newPassword: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
});
