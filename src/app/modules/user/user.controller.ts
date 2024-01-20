import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TDecodedUser } from './user.interface';
import { UserServices } from './user.service';

//create user
const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User has been registered succesfully',
    data: result,
  });
});

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  const { accesstoken, userFromDB } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been logged in succesfully',
    data: {
      user: {
        _id: userFromDB?._id,
        username: userFromDB?.username,
        email: userFromDB?.email,
        role: userFromDB?.role,
      },
      token: accesstoken,
    },
  });
});

//change password
const changePassword = catchAsync(async (req, res) => {
  const passwordData = req.body;
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.changePasswordInDB(
    passwordData,
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been changed succesfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  changePassword,
};
