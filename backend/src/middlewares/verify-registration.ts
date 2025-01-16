import { getEmployeeByUsername } from '../modules/master/employees/employee.repository';
import { Request, Response, NextFunction } from 'express';
import { requestErrorResponse, internalErrorResponse } from '../utils/response';

const checkDuplicateUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;

    const existingUserByUsername = await getEmployeeByUsername(username);

    if (existingUserByUsername) {
      return requestErrorResponse(
        res,
        `Existing User with username ${username} is already exist`,
      );
    }
    return next();
  } catch {
    return internalErrorResponse(res, 'Unable to validate user!');
  }
};

export default {
  checkDuplicateUsername,
};
