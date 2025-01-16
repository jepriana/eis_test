import { Request, Response } from "express"
import * as repository from "./role.repository"
import {
    okResponse,
    createdResponse,
    noContentResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse
} from "../../../utils/response"

export async function createRole(req: Request, res: Response) {
    try {
        const { name, description } = req.body;
        // Validate request
        if (!name) {
            return requestErrorResponse(res, 'Role name can not be empty!');
        }

        const existingRole = await repository.getRoleByName(name);
        if (existingRole) {
            return requestErrorResponse(
                res,
                `Existing role with name ${name} is already exist`,
            );
        }

        const newRole = {
            name,
            description,
        };

        // Saving Role into database
        const createdRole = await repository.addRole(newRole);
        if (createdRole) {
            return createdResponse(res, createdRole);
        }
        return internalErrorResponse(res, 'Some error occured while creating role.');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while creating role.',
        );
    }
}

export async function getAllRoles(req: Request, res: Response) {
    try {
        const { keyword } = req.query;
        const result = await repository.getAllRoles(keyword?.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving roles.',
        );
    }
}

export async function getAllRoleWithPaginations(req: Request, res: Response) {
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
        return notFoundErrorResponse(res, 'No role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving roles.',
        );
    }
}

export async function getRoleById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getRoleById(id.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving role.',
        );
    }
}

export async function getRoleByName(req: Request, res: Response) {
    try {
        const { name } = req.params;
        const result = await repository.getRoleByName(name);
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving role.',
        );
    }
}

export async function updateRole(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getRoleById(id.toString());
        if (result) {
            const { name, description } = req.body;
            // Validate request
            if (name) {
                const existingRole = await repository.getRoleByName(name);
                if (existingRole && existingRole.id !== id) {
                    return requestErrorResponse(
                        res,
                        `Existing role with name ${name} is already exist`,
                    );
                }
            }
            if (!name) {
                return requestErrorResponse(res, 'Role name can not be empty!');
            }
            const updatedUser = await repository.updateRole(id, {
                name: name || result.name,
                description,
            });
            if (updatedUser) {
                return noContentResponse(res, 'Role was updated successfully');
            }
            return internalErrorResponse(res, 'Some error occured while updating role.');
        }
        return notFoundErrorResponse(res, 'No role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while updating role',
        );
    }
}

export async function deleteRole(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.getRoleById(id.toString());
        if (result) {
            const deletedUser = await repository.deleteRole(id);
            if (deletedUser) {
                return noContentResponse(res, 'Role was deleted successfully');
            }
            return internalErrorResponse(res, 'Some error occured while deleting role.');
        }
        return notFoundErrorResponse(res, `Cannot delete role with id ${id}. Role was not found.`);
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while deleting role',
        );
    }
}