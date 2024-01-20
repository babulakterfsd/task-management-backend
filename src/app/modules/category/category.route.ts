import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import { categorySchema } from './category.validation';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(categorySchema),
  CategoryControllers.createCategory,
);

router.get('/', CategoryControllers.getAllCategories);

export const CategoryRoutes = router;
