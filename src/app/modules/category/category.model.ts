import { Schema, model } from 'mongoose';
import { TCategory, TCategoryModel } from './category.interface';

const categorySchema = new Schema<TCategory, TCategoryModel>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
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

//checking if the categoryId really exists or not, for the course to be created.
categorySchema.statics.isCategoryIdExists = async function (
  categoryId: string,
) {
  const category = await this.findById(categoryId);
  return !!category;
};

export const CategoryModel = model<TCategory, TCategoryModel>(
  'categories',
  categorySchema,
);
