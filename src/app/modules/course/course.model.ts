import { Schema, model } from 'mongoose';
import { TCourse, TCourseModel } from './course.interface';

const courseSchema = new Schema<TCourse, TCourseModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: [
      {
        name: {
          type: String,
          required: true,
        },
        isDeleted: {
          type: Boolean,
          required: true,
        },
      },
    ],
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    durationInWeeks: {
      type: Number,
    },
    language: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    details: {
      level: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.durationInWeeks;
      },
    },
  },
);

//checking if the courseId really exists or not, for the review to be created
courseSchema.statics.isCourseIdExists = async function (courseId: string) {
  const course = await this.findById(courseId);
  return !!course;
};

export const CourseModel = model<TCourse, TCourseModel>(
  'courses',
  courseSchema,
);
