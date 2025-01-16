import { Request, Response, NextFunction } from 'express';
import prisma from '../configs/prisma.config'
import { authenticationErrorResponse, authorizationErrorResponse, internalErrorResponse } from '../utils/response';
import { TokenManager } from '../utils/token-manager'
import jwt from 'jsonwebtoken'

const User = prisma.employee;

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.length < 2) {
    return authenticationErrorResponse(res, 'No token provided!');
  }
  const token = authorization.split(' ')[1];
  try {
    const payload = TokenManager.verifyAccessToken(token);
    if (payload.id) {
      const user = await User.findUnique({
        where: {
          id: payload.id,
        }
      });
      if (user && user.isAdmin === true) {
        return next();
      }
    }

    return authorizationErrorResponse(res, 'Admin role required');
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return authenticationErrorResponse(res, 'Unauthorized!');
    }
    // otherwise, return a internal server error
    return internalErrorResponse(res, 'Unable to validate admin role!');
  }
};

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.length < 2) {
    return authenticationErrorResponse(res, 'No token provided!');
  }
  const token = authorization.split(' ')[1];
  try {
    const payload = TokenManager.verifyAccessToken(token);
    if (payload.id) {
      return next();
    }
    return authenticationErrorResponse(res, 'Unauthorized!');
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return authenticationErrorResponse(res, 'Unauthorized!');
    }
    // otherwise, return a internal server error
    return internalErrorResponse(res, 'Unable to validate user authentication!');
  }
};

export default {
  isAdmin,
  isAuthenticated,
};

