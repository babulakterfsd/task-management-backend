import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import {
  changePasswordSchema,
  loginSchema,
  userSchema,
} from './user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(userSchema),
  UserControllers.createUser,
);

router.post('/login', validateRequest(loginSchema), UserControllers.loginUser);

router.post(
  '/change-password',
  validateRequest(changePasswordSchema),
  UserControllers.changePassword,
);

export const UserRoutes = router;
