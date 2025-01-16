import { Request, Response, NextFunction } from 'express';
import prisma from '../configs/prisma.config'
import { authenticationErrorResponse, authorizationErrorResponse, internalErrorResponse } from '../utils/response';
import { TokenManager } from '../utils/token-manager'

const User = prisma.employee;

const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
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
                    id: payload.id
                }
            });
            if (user && (user.isAdmin === true || user.id === employeeId)) {
                return next();
            }
        }

        return authorizationErrorResponse(
            res,
            'You don\'t have permission to access this page/data',
        );
    } catch {
        return internalErrorResponse(res, 'Unable to validate user access!');
    }
};

export default {
    isOwner,
};

