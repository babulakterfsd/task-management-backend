import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const requestBody = {
    ...req?.body,
    createdBy: req?.user?.id,
  };

  const result = await ReviewServices.createReviewInDB(requestBody);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review has been created succesfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
};
