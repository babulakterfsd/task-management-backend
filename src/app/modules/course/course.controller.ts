import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

//create course
const createCourse = catchAsync(async (req, res) => {
  // organize category name and createdBy from the request
  const courseDataWithUserInfo = {
    ...req?.body,
    createdBy: req?.user?.id,
  };

  const result = await CourseServices.createCourseInDB(courseDataWithUserInfo);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course has been created succesfully',
    data: result,
  });
});

//get all courses
const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses have been fetched succesfully',
    meta: result?.meta,
    data: result?.resultToBeReturned,
  });
});

//update course
const updateCourse = catchAsync(async (req, res) => {
  const courseId = req?.params?.courseId;
  const result = await CourseServices.updateCourseInDB(courseId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course has been updated succesfully',
    data: result,
  });
});

// get single course with reviews
const getSingleCourseWithReviews = catchAsync(async (req, res) => {
  const courseId = req?.params?.courseId;
  const result =
    await CourseServices.getSingleCourseWithReviewsFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course with reviews has been fetched succesfully',
    data: result,
  });
});

//get the best course depending on the average rating
const getBestCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getBestCourseFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course has been fetched succesfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  updateCourse,
  getSingleCourseWithReviews,
  getBestCourse,
};
