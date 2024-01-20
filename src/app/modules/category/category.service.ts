import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';

const createCategoryInDB = async (requestBody: TCategory) => {
  const result = await CategoryModel.create(requestBody);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category');
  } else {
    return result;
  }
};

const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find()
    .populate({
      path: 'createdBy',
      model: 'users',
      select: '_id username email role',
    })
    .exec();

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to retrieve categories');
  } else {
    return {
      categories: result,
    };
  }
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
};
