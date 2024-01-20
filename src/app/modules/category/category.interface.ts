/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TCategory = {
  name: string;
  createdBy: Types.ObjectId;
};

//for creating statics
export interface TCategoryModel extends Model<TCategory> {
  isCategoryIdExists(categoryId: string): Promise<TCategory | null>;
}
