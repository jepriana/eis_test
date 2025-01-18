import { Request, Response } from "express"
import * as repository from "./log.repository"
import {
    okResponse,
    createdResponse,
    noContentResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse
} from "../../../utils/response"

export async function createAuthLog(req: Request, res: Response) {
    try {
        const { employeeId, transaction, isSucceed, authAt } = req.body;
        // Validate request
        if (!employeeId) {
            return requestErrorResponse(res, 'AuthLog employeeId can not be empty!');
        }
        if (!transaction) {
            return requestErrorResponse(res, 'AuthLog transaction can not be empty!');
        }
        if (!isSucceed) {
            return requestErrorResponse(res, 'AuthLog isSucceed can not be empty!');
        }
        if (!authAt) {
            return requestErrorResponse(res, 'AuthLog authAt can not be empty!');
        }

        const newAuthLog = {
            employeeId,
            transaction,
            isSucceed,
            authAt
        };

        // Saving AuthLog into database
        const createdAuthLog = await repository.addAuthLog(newAuthLog);
        if (createdAuthLog) {
            return createdResponse(res, createdAuthLog);
        }
        return internalErrorResponse(res, 'Some error occured while creating authLog.');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while creating authLog.',
        );
    }
}

export async function getAllAuthLogs(req: Request, res: Response) {
    try {
        const { keyword } = req.query;
        const result = await repository.getAllAuthLogs(keyword?.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No authLog data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving authLogs.',
        );
    }
}

export async function getAllAuthLogWithPaginations(req: Request, res: Response) {
    try {
        const fullUrl = req.protocol + '://' + req.get('host') + req.path;
        const { keyword } = req.query;
        let { pageNumber, pageSize } = req.query;
        pageNumber = pageNumber?.toString() || '1'
        pageSize = pageSize?.toString() || '10'
        const result = await repository.getAllPagination(keyword?.toString(), parseInt(pageNumber), parseFloat(pageSize), fullUrl)

        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No authLog data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving authLogs.',
        );
    }
}

export async function getAuthLogById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getAuthLogById(id.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No authLog data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving authLog.',
        );
    }
}

export async function updateAuthLog(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getAuthLogById(id.toString());
        if (result) {
            const { employeeId, transaction, isSucceed, authAt } = req.body;
            // Validate request
            if (!employeeId) {
                return requestErrorResponse(res, 'AuthLog employeeId can not be empty!');
            }
            if (!transaction) {
                return requestErrorResponse(res, 'AuthLog transaction can not be empty!');
            }
            if (!isSucceed) {
                return requestErrorResponse(res, 'AuthLog isSucceed can not be empty!');
            }
            if (!authAt) {
                return requestErrorResponse(res, 'AuthLog authAt can not be empty!');
            }
            const updatedUser = await repository.updateAuthLog(id, {
                employeeId,
                transaction,
                isSucceed,
                authAt
            });
            if (updatedUser) {
                return noContentResponse(res, 'AuthLog was updated successfully');
            }
            return internalErrorResponse(res, 'Some error occured while updating authLog.');
        }
        return notFoundErrorResponse(res, 'No authLog data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while updating authLog',
        );
    }
}

export async function deleteAuthLog(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getAuthLogById(id.toString());
        if (result) {
            const deletedUser = await repository.deleteAuthLog(id);
            if (deletedUser) {
                return noContentResponse(res, 'AuthLog was deleted successfully');
            }
            return internalErrorResponse(res, 'Some error occured while deleting authLog.');
        }
        return notFoundErrorResponse(res, `Cannot delete authLog with id ${id}. AuthLog was not found.`);
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while deleting authLog',
        );
    }
}