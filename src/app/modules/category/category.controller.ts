import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {
  // organize category name and createdBy from the request
  const requestBody = {
    name: req?.body?.name,
    createdBy: req?.user?.id,
  };

  const result = await CategoryServices.createCategoryInDB(requestBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category has been created succesfully',
    data: result,
  });
});

const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories have been retrieved succesfully',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
};
