import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, TUserModel } from './user.interface';

const userSchema = new Schema<TUser, TUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long'],
      validate: {
        validator: (value: string) => {
          // Password must contain at least one letter and one numeric character
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
          return passwordRegex.test(value);
        },
        message: () =>
          'Password should contain at least one letter and one numeric character',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message:
          '{VALUE} is not a valid role. Choose either "user" or "admin".',
      },
      default: 'user',
    },
    lastTwoPasswords: [
      {
        oldPassword: String,
        changedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.lastTwoPasswords;
      },
    },
  },
);

// hashing the password before saving it to the database
userSchema.pre<TUser>('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// another layer of making sure that the password is not returned in the response
userSchema.post<TUser>('save', function (doc, next) {
  doc.password = '';

  next();
});

//custom static method to check if the user exists or not
userSchema.statics.isUserExistsWithUsername = async function (
  username: string,
) {
  const userFoundWithUsername = await UserModel.findOne({ username });
  return userFoundWithUsername;
};
userSchema.statics.isUserExistsWithEmail = async function (email: string) {
  const userFoundWithEmail = await UserModel.findOne({ email });
  return userFoundWithEmail;
};

export const UserModel = model<TUser, TUserModel>('users', userSchema);
