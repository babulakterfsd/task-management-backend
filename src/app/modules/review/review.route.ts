import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './review.controller';
import { reviewSchema } from './review.validation';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(reviewSchema),
  ReviewControllers.createReview,
);

export const ReviewRoutes = router;
