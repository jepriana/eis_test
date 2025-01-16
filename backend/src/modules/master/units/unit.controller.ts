import { Request, Response } from "express"
import * as repository from "./unit.repository"
import {
    okResponse,
    createdResponse,
    noContentResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse
} from "../../../utils/response"

export async function createUnit(req: Request, res: Response) {
    try {
        const { name, description } = req.body;
        // Validate request
        if (!name) {
            return requestErrorResponse(res, 'Unit name can not be empty!');
        }

        const existingUnit = await repository.getUnitByName(name);
        if (existingUnit) {
            return requestErrorResponse(
                res,
                `Existing unit with name ${name} is already exist`,
            );
        }

        const newUnit = {
            name,
            description,
        };

        // Saving Unit into database
        const createdUnit = await repository.addUnit(newUnit);
        if (createdUnit) {
            return createdResponse(res, createdUnit);
        }
        return internalErrorResponse(res, 'Some error occured while creating unit.');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while creating unit.',
        );
    }
}

export async function getAllUnits(req: Request, res: Response) {
    try {
        const { keyword } = req.query;
        const result = await repository.getAllUnits(keyword?.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No unit data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving units.',
        );
    }
}

export async function getAllUnitWithPaginations(req: Request, res: Response) {
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
        return notFoundErrorResponse(res, 'No unit data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving units.',
        );
    }
}

export async function getUnitById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getUnitById(id.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No unit data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving unit.',
        );
    }
}

export async function getUnitByName(req: Request, res: Response) {
    try {
        const { name } = req.params;
        const result = await repository.getUnitByName(name);
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No unit data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving unit.',
        );
    }
}

export async function updateUnit(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getUnitById(id.toString());
        if (result) {
            const { name, description } = req.body;
            // Validate request
            if (name) {
                const existingUnit = await repository.getUnitByName(name);
                if (existingUnit && existingUnit.id !== id) {
                    return requestErrorResponse(
                        res,
                        `Existing unit with name ${name} is already exist`,
                    );
                }
            }
            if (!name) {
                return requestErrorResponse(res, 'Unit name can not be empty!');
            }
            const updatedUser = await repository.updateUnit(id, {
                name: name || result.name,
                description,
            });
            if (updatedUser) {
                return noContentResponse(res, 'Unit was updated successfully');
            }
            return internalErrorResponse(res, 'Some error occured while updating unit.');
        }
        return notFoundErrorResponse(res, 'No unit data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while updating unit',
        );
    }
}

export async function deleteUnit(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getUnitById(id.toString());
        if (result) {
            const deletedUser = await repository.deleteUnit(id);
            if (deletedUser) {
                return noContentResponse(res, 'Unit was deleted successfully');
            }
            return internalErrorResponse(res, 'Some error occured while deleting unit.');
        }
        return notFoundErrorResponse(res, `Cannot delete unit with id ${id}. Unit was not found.`);
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while deleting unit',
        );
    }
}