/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import calculateWeeksDuration from '../../utils/calculateWeeksDuration';
import { CategoryModel } from '../category/category.model';
import { ReviewModel } from '../review/review.model';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';

//create course in DB
const createCourseInDB = async (course: TCourse) => {
  const categoryId = course.categoryId.toString();
  const categoryExists = await CategoryModel.isCategoryIdExists(categoryId);
  if (!categoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'CategoryId does not exists');
  }
  const { startDate, endDate } = course;
  const durationInWeeks = calculateWeeksDuration(startDate, endDate);

  course = {
    ...course,
    durationInWeeks,
  };

  const result = await CourseModel.create(course);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create course');
  } else {
    //calculate duration in weeks
    const { startDate, endDate } = result;
    const durationInWeeks = calculateWeeksDuration(startDate, endDate);

    const resultToBeReturned = {
      ...result.toJSON(),
      durationInWeeks,
    };

    return resultToBeReturned;
  }
};

//get all courses from DB
const getAllCoursesFromDB = async (query: any) => {
  const totalDocs = await CourseModel.countDocuments();

  const meta = {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10,
    total: totalDocs,
  };

  const {
    page,
    limit,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = query;

  //implement pagination
  const pageToBeFetched = Number(page) || 1;
  const limitToBeFetched = Number(limit) || 10;
  const skip = (pageToBeFetched - 1) * limitToBeFetched;

  //sort
  const sortCheck: Record<string, 1 | -1> = {};

  if (
    sortBy &&
    [
      'title',
      'price',
      'startDate',
      'endDate',
      'language',
      'durationInWeeks',
    ].includes(sortBy)
  ) {
    sortCheck[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // filter
  const filter: Record<string, any> = {};

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (tags) {
    const regexTags = tags
      .split(',')
      .map((tag: string) => new RegExp(tag, 'i'));

    filter['tags.name'] = {
      $in: regexTags,
    };
  }

  if (startDate) {
    filter.startDate = {
      $gte: startDate,
    };
  }

  if (endDate) {
    filter.endDate = {
      $lte: endDate,
    };
  }

  if (language) {
    filter.language = new RegExp(language, 'i');
  }

  if (provider) {
    filter.provider = new RegExp(provider, 'i');
  }

  if (durationInWeeks) {
    filter.durationInWeeks = durationInWeeks;
  }

  if (level) {
    filter['details.level'] = new RegExp(level, 'i');
  }

  //fetch courses
  const result = await CourseModel.find(filter)
    .sort(sortCheck)
    .skip(skip)
    .limit(limitToBeFetched)
    .populate({
      path: 'createdBy',
      model: 'users',
      select: '_id username email role',
    })
    .exec();

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to get courses');
  } else {
    const resultToBeReturned = result.map((course) => {
      const { startDate, endDate } = course;
      const durationInWeeks = calculateWeeksDuration(startDate, endDate);

      return {
        ...course.toJSON(),
        durationInWeeks,
      };
    });

    return {
      meta,
      resultToBeReturned,
    };
  }
};

//update a course
const updateCourseInDB = async (
  courseId: string,
  updatedCourseData: TCourse,
) => {
  if (updatedCourseData?.categoryId) {
    const categoryId = updatedCourseData?.categoryId?.toString();
    const categoryExists = await CategoryModel.isCategoryIdExists(categoryId);
    if (!categoryExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'CategoryId does not exist');
    }
  }

  const courseExists = await CourseModel.isCourseIdExists(courseId);
  if (!courseExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'CourseId does not exist');
  }

  const exist = await CourseModel.findById(courseId);

  if (!exist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course not found');
  }

  const course = updatedCourseData;
  const id = courseId;

  const newTags = course.tags.map((tag) => ({
    name: tag.name,
    isDeleted: tag.isDeleted,
  }));

  const existTags = exist.tags.map((tag) => ({
    name: tag.name,
    isDeleted: tag.isDeleted,
  }));

  newTags.forEach((newTag) => {
    const existingTagIndex = existTags.findIndex(
      (tag) => tag.name === newTag.name,
    );

    if (existingTagIndex !== -1) {
      existTags[existingTagIndex].isDeleted = newTag.isDeleted;
    } else {
      existTags.push(newTag);
    }
  });

  const result = await CourseModel.findByIdAndUpdate(
    { _id: id },
    {
      title: course.title,
      instructor: course.instructor,
      categoryId: course.categoryId,
      price: course.price,
      startDate: course.startDate,
      endDate: course.endDate,
      durationInWeeks: course.durationInWeeks,
      language: course.language,
      provider: course.provider,
      createdBy: course.createdBy,
      details: {
        level: course.details.level,
        description: course.details.description,
      },
      tags: existTags,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  } else {
    const getPopulatedVersionOfTheUpdatedCourse = await CourseModel.findById(
      courseId,
    )
      .populate({
        path: 'createdBy',
        model: 'users',
        select: '_id username email role',
      })
      .exec();

    // Calculate duration in weeks
    const { startDate, endDate } = result;
    const durationInWeeks = calculateWeeksDuration(startDate, endDate);

    const resultToBeReturned = {
      ...getPopulatedVersionOfTheUpdatedCourse?.toJSON(),
      durationInWeeks,
    };

    return resultToBeReturned;
  }
};

// get single course with reviews
const getSingleCourseWithReviewsFromDB = async (courseId: string) => {
  const isCourseIdExists = await CourseModel.findById(courseId);
  if (!isCourseIdExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'CourseId does not exist');
  }

  const course = await CourseModel.findById(courseId)
    .populate({
      path: 'createdBy',
      model: 'users',
      select: '_id username email role',
    })
    .exec();

  if (!course) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course not found');
  }
  let noReviewYet = null;
  const reviews = await ReviewModel.find({ courseId: courseId })
    .populate({
      path: 'createdBy',
      model: 'users',
      select: '_id username email role',
    })
    .exec();

  if (!reviews || reviews.length === 0) {
    noReviewYet = 'No review yet';
  }

  const { startDate, endDate } = course;
  const durationInWeeks = calculateWeeksDuration(startDate, endDate);

  const courseWithDurationInWeeks = {
    ...course.toJSON(),
    durationInWeeks,
  };

  return {
    course: courseWithDurationInWeeks,
    reviews: reviews.length > 0 ? reviews : noReviewYet,
  };
};

//get the best course based on rating
const getBestCourseFromDB = async () => {
  const bestCourse = await CourseModel.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        averageRating: {
          $avg: '$reviews.rating',
        },
        reviewCount: {
          $size: '$reviews',
        },
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  if (!bestCourse || bestCourse.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No best course found');
  }

  const course = bestCourse[0];
  const { _id } = course;
  const populatedBestCourse = await CourseModel.findById(_id)
    .populate({
      path: 'createdBy',
      model: 'users',
      select: '_id username email role',
    })
    .exec();

  const formattedData = {
    course: {
      _id: course._id,
      title: course?.title,
      instructor: course?.instructor,
      categoryId: course?.categoryId,
      price: course?.price,
      tags: course?.tags,
      startDate: course?.startDate,
      endDate: course?.endDate,
      language: course?.language,
      provider: course?.provider,
      durationInWeeks: course?.durationInWeeks,
      details: course?.details,
      createdBy: populatedBestCourse?.createdBy,
      createdAt: course?.createdAt,
      updatedAt: course?.updatedAt,
    },
    averageRating: Number(course.averageRating.toFixed(1)),
    reviewCount: course.reviewCount,
  };

  return formattedData;
};

export const CourseServices = {
  createCourseInDB,
  getAllCoursesFromDB,
  updateCourseInDB,
  getSingleCourseWithReviewsFromDB,
  getBestCourseFromDB,
};
