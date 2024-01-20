import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    // checking token is valid or not
    const decodedUser = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email } = decodedUser;

    // checking if the user is exist
    const user = await UserModel.isUserExistsWithEmail(email);

    if (!user) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new JsonWebTokenError('Unauthorized Access!');
    }

    req.user = decodedUser as JwtPayload & { role: string };
    next();
  });
};

export default auth;
