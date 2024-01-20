/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TTag = {
  name: string;
  isDeleted: boolean;
};

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTag[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details: {
    level: string;
    description: string;
  };
  createdBy?: Types.ObjectId;
};

//for creating statics
export interface TCourseModel extends Model<TCourse> {
  isCourseIdExists(courseId: string): Promise<TCourse | null>;
}
