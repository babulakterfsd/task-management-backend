import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'courses',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger, // Check if the value is an integer
        message: 'Rating must be an integer',
      },
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must can not be more than 5'],
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ReviewModel = model<TReview>('reviews', reviewSchema);
