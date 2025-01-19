import { Request, Response } from "express"
import { EmployeeUnitRole, NewEmployeeUnitRole } from "./employee-unit-role.interface"
import * as repository from "./employee-unit-role.repository"
import {
    okResponse,
    createdResponse,
    noContentResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse
} from "../../../utils/response"

export async function createEmployeeUnitRole(req: Request, res: Response) {
    try {
        const {
            employeeId,
            unitId,
            roleId,
        } = req.body;
        // Validate request
        if (!employeeId) {
            return requestErrorResponse(res, 'Employee ID can not be empty!');
        }
        if (!unitId) {
            return requestErrorResponse(res, 'Unit ID can not be empty!');
        }
        if (!roleId) {
            return requestErrorResponse(res, 'Role ID can not be empty!');
        }

        const newemployeeUnitRole: NewEmployeeUnitRole = {
            employeeId,
            unitId,
            roleId,
        };

        // Saving unit role into database
        const createdemployeeUnitRole: EmployeeUnitRole | null = await repository.addEmployeeUnitRole(newemployeeUnitRole);
        if (createdemployeeUnitRole) {
            return createdResponse(res, createdemployeeUnitRole);
        }
        return internalErrorResponse(res, 'Some error occured while creating unit role.');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while creating unit role.',
        );
    }
}

export async function getAllEmployeeUnitRoles(req: Request, res: Response) {
    try {
        const { employeeId, unitId, roleId } = req.query;
        const result = await repository.getAllEmployeeUnitRoles(employeeId?.toString(), unitId?.toString(), roleId?.toString());
        
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No unit role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving unit roles.',
        );
    }
}

export async function getAllEmployeeUnitRoleWithPaginations(req: Request, res: Response) {
    try {
        const fullUrl = req.protocol + '://' + req.get('host') + req.path;
        const { employeeId, unitId, roleId } = req.query;
        let { pageNumber, pageSize } = req.query;
        pageNumber = pageNumber?.toString() || '1'
        pageSize = pageSize?.toString() || '10'
        const result = await repository.getAllEmployeeWithPagination(employeeId?.toString(), unitId?.toString(), roleId?.toString(), parseInt(pageNumber), parseFloat(pageSize), fullUrl)

        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No unit role data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving unit roles. ',
        );
    }
}

export async function getEmployeeUnitRoleById(req: Request, res: Response) {
    try {
        const { employeeUnitRoleId } = req.params;
        const result: EmployeeUnitRole | null = await repository.getEmployeeUnitRoleById(employeeUnitRoleId.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, `No unit role with ID ${employeeUnitRoleId} found`);
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving unit roles.',
        );
    }
}

export async function updateEmployeeUnitRole(req: Request, res: Response) {
    try {
        const { employeeUnitRoleId } = req.params;
        const result: EmployeeUnitRole | null = await repository.getEmployeeUnitRoleById(employeeUnitRoleId.toString());
        if (result) {
            const {
                employeeId,
                roleId,
                unitId,
            } = req.body;
            // Validate request
            if (!unitId) {
                return requestErrorResponse(res, 'Unit ID can not be empty!');
            }
            if (!employeeId) {
                return requestErrorResponse(res, 'Employee ID can not be empty!');
            }
            if (!roleId) {
                return requestErrorResponse(res, 'Role ID can not be empty!');
            }

            const updateemployeeUnitRole: NewEmployeeUnitRole = {
                employeeId,
                roleId,
                unitId,
            };

            const updatedemployeeUnitRole = await repository.updateEmployeeUnitRole(employeeUnitRoleId,updateemployeeUnitRole);

            if (updatedemployeeUnitRole) {
                return noContentResponse(res, 'Unit role was updated successfully');
            }
            return internalErrorResponse(res, 'Some error occured while updating unit role.');
        }
        return notFoundErrorResponse(res, 'No unit role data found');
    } catch (e){
        console.log('Some error occured while updating unit role.\n', e);
        return internalErrorResponse(
            res,
            'Some error occured while updating unit role.',
        );
    }
}

export async function deleteEmployeeUnitRole(req: Request, res: Response) {
    try {
        const { employeeUnitRoleId } = req.params;
        const result: EmployeeUnitRole | null = await repository.getEmployeeUnitRoleById(employeeUnitRoleId.toString());
        if (result) {
            const deletedemployeeUnitRole = await repository.deleteEmployeeUnitRole(employeeUnitRoleId);
            if (deletedemployeeUnitRole) {
                return noContentResponse(res, 'Unit role was deleted successfully');
            }
            return internalErrorResponse(res, 'Some error occured while creating unit role.');
        }
        return notFoundErrorResponse(res, `Cannot delete unit role with ID ${employeeUnitRoleId}. Unit role was not found.`);
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while deleting unit role.',
        );
    }
}