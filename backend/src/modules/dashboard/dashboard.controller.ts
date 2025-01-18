import { Request, Response } from "express"
import * as repository from "./dashboard.repository"
import {
    okResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse
} from "../../utils/response"

export async function getDashboardSummary(req: Request, res: Response) {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || new Date(startDate.toString()).toString() === 'Invalid Date') {
            return requestErrorResponse(res, 'Start Date can not be empty and should be in YYYY-MM-DD format!');
        }
        if (!endDate || new Date(endDate.toString()).toString() === 'Invalid Date') {
            return requestErrorResponse(res, 'End Date can not be empty and should be in YYYY-MM-DD format!');
        }
        const summary = await repository.getDashboardSummary(new Date(startDate.toString()), new Date(endDate.toString()));
        if (summary) {
            return okResponse(res, summary);
        }
        return notFoundErrorResponse(res, 'No data summary found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving summary.',
        );
    }
}