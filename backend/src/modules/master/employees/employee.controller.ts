import { Request, Response } from "express"
import { Employee, EmployeeDetail, EmployeeWithPassword, NewEmployee } from "./employee.interface"
import * as repository from "./employee.repository"
import bcrypt from "bcryptjs"
import {
    okResponse,
    createdResponse,
    noContentResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse
} from "../../../utils/response"

export async function createEmployee(req: Request, res: Response) {
    try {
        const { username, fullName, password, joinAt } = req.body;
        // Validate request
        if (!username) {
            return requestErrorResponse(res, 'Username can not be empty!');
        }
        if (!fullName) {
            return requestErrorResponse(res, 'Employee full name can not be empty!');
        }
        if (!password) {
            return requestErrorResponse(res, 'Employee password can not be empty!');
        }

        const existingEmployee = await repository.getEmployeeByUsername(username);

        if (existingEmployee) {
            return requestErrorResponse(
                res,
                `Existing employee with username ${username} is already exist`,
            );
        }

        let joinDate = new Date();
        if (joinAt) {
            joinDate = new Date(joinAt);
        }

        const newEmployee: NewEmployee = {
            username: username,
            fullName: fullName,
            isAdmin: false,
            password: bcrypt.hashSync(password, 8),
            joinAt: joinDate,
        };

        // Saving employee into database
        const createdEmployee: Employee | null = await repository.addEmployee(newEmployee);
        if (createdEmployee) {
            return createdResponse(res, createdEmployee);
        }
        return internalErrorResponse(res, 'Some error occured while creating Employee.');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while creating Employee.',
        );
    }
}

export async function getAllEmployees(req: Request, res: Response) {
    try {
        const { keyword } = req.query;
        const result = await repository.getAllEmployees(keyword?.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No employee data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving Employees.',
        );
    }
}

export async function getAllEmployeeWithPaginations(req: Request, res: Response) {
    try {
        const fullUrl = req.protocol + '://' + req.get('host') + req.path;
        const { keyword } = req.query;
        let { pageNumber, pageSize } = req.query;
        pageNumber = pageNumber?.toString() || '1'
        pageSize = pageSize?.toString() || '10'
        const result = await repository.getAllEmployeeWithPagination(keyword?.toString(), parseInt(pageNumber), parseFloat(pageSize), fullUrl)

        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No employee data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving Employees.',
        );
    }
}

export async function getEmployeeById(req: Request, res: Response) {
    try {
        const { employeeId } = req.params;
        const result: EmployeeDetail | null = await repository.getEmployeeById(employeeId.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No employee data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving Employees.',
        );
    }
}

export async function getEmployeeByUsername(req: Request, res: Response) {
    try {
        const { username } = req.params;
        const result: EmployeeDetail | null = await repository.getEmployeeByUsername(username.toString());
        if (result) {
            return okResponse(res, result);
        }
        return notFoundErrorResponse(res, 'No employee data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while retreiving employees.',
        );
    }
}

export async function updateEmployee(req: Request, res: Response) {
    try {
        const { employeeId } = req.params;
        const result: EmployeeWithPassword | null = await repository.getEmployeeWithPasswordById(employeeId.toString());
        if (result) {
            const { username, fullName, password, joinAt, isAdmin } = req.body;
            // Validate request
            if (!username) {
                return requestErrorResponse(res, 'Username can not be empty!');
            }
            if (!fullName) {
                return requestErrorResponse(res, 'Employee full name can not be empty!');
            }

            let joinDate = new Date();
            if (joinAt) {
                joinDate = new Date(joinAt);
            }
            const updatedEmployee = await repository.updateEmployee(employeeId, {
                username,
                fullName,
                isAdmin: isAdmin ?? result.isAdmin,
                joinAt: joinDate,
                password: password != null ? bcrypt.hashSync(password, 8) : result.password
            });
            if (updatedEmployee) {
                return noContentResponse(res, 'Employee was updated successfully');
            }
            return internalErrorResponse(res, 'Some error occured while creating Employee.');
        }
        return notFoundErrorResponse(res, 'No employee data found');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while updating employee.',
        );
    }
}

export async function deleteEmployee(req: Request, res: Response) {
    try {
        const { employeeId } = req.params;
        const result: EmployeeDetail | null = await repository.getEmployeeById(employeeId.toString());
        if (result) {
            const deletedEmployee = await repository.deleteEmployee(employeeId);
            if (deletedEmployee) {
                return noContentResponse(res, 'Employee was deleted successfully');
            }
            return internalErrorResponse(res, 'Some error occured while creating Employee.');
        }
        return notFoundErrorResponse(res, `Cannot delete employee with id ${employeeId}. employee was not found.`);
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while deleting employee.',
        );
    }
}