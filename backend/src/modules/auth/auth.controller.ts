import { Request, Response } from "express"
import { Employee, EmployeeDetail, NewEmployee } from "../master/employees/employee.interface"
import * as employeeRepository from "../master/employees/employee.repository"
import { addAuthLog } from "../master/logs/log.repository"
import bcrypt from "bcryptjs"
import { TokenManager } from "../../utils/token-manager"
import jwt from 'jsonwebtoken'
import {
    okResponse,
    createdResponse,
    requestErrorResponse,
    notFoundErrorResponse,
    internalErrorResponse,
    authenticationErrorResponse
} from "../../utils/response"

export async function register(req: Request, res: Response) {
    try {
        let isAdmin = false;
        const { username, fullName, password, secretCode } = req.body;
        // Validate request
        if (!fullName) {
            return requestErrorResponse(res, 'User full name can not be empty!');
        }
        if (!username) {
            return requestErrorResponse(res, 'Username can not be empty!');
        }
        if (!password) {
            return requestErrorResponse(res, 'User password can not be empty!');
        }
        if (secretCode && secretCode === process.env.SECRET_CODE) {
            isAdmin = true;
        }

        const newEmployee: NewEmployee = {
            username,
            fullName,
            isAdmin: isAdmin ?? false,
            joinAt: new Date(),
            password: bcrypt.hashSync(password, 8)
        };

        // Saving User into database
        const createdEmployee: Employee | null = await employeeRepository.addEmployee(newEmployee);
        if (createdEmployee) {
            await addAuthLog({ employeeId: createdEmployee.id.toString(), transaction: 'Register', authAt: new Date(), isSucceed: true });
            return createdResponse(res, createdEmployee);
        }
        return internalErrorResponse(res, 'Some error occured while registering User.');
    } catch {
        return internalErrorResponse(
            res,
            'Some error occured while regisstering User.',
        );
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        // Validate request
        if (!username) {
            return requestErrorResponse(res, 'Username can not be empty!');
        }
        if (!password) {
            return requestErrorResponse(res, 'Password can not be empty!');
        }
        const targetEmployee: EmployeeDetail | null = await employeeRepository.getEmployeeByUsername(username);
        if (!targetEmployee) {
            return notFoundErrorResponse(res, 'No user found or password is invalid');
        }
        const employeeWithPassword = await employeeRepository.getEmployeeWithPasswordById(targetEmployee.id.toString());
        if (employeeWithPassword) {
            const passwordIsValid = bcrypt.compareSync(password, employeeWithPassword.password)
            if (passwordIsValid) {
                const accessToken = TokenManager.generateAccessToken({
                    id: targetEmployee.id,
                    isAdmin: targetEmployee.isAdmin,
                    // authorities,
                });
                const refreshToken = TokenManager.generateRefreshToken({
                    id: targetEmployee.id,
                });
                await addAuthLog({ employeeId: targetEmployee.id.toString(), transaction: 'Login', authAt: new Date(), isSucceed: true });
                return okResponse(res, {
                    accessToken,
                    refreshToken,
                    userData: targetEmployee,
                });
            }
        }
        return requestErrorResponse(res, "No user found or password is invalid");
    } catch (err) {
        console.error(err);
        return internalErrorResponse(
            res,
            'Some error occured while authenticating User',
        );
    }
}

export async function refreshToken(req: Request, res: Response) {
    try {
        const { refreshToken } = req.body;

        // Validate request
        if (!refreshToken) {
            return requestErrorResponse(res, 'Refresh Token can not be empty!');
        }
        const payload = TokenManager.verifyRefreshToken(refreshToken);
        if (payload.id) {
            const targetEmployee = await employeeRepository.getEmployeeById(payload.id);
            if (!targetEmployee) {
                return notFoundErrorResponse(res, 'No user found or refresh token is invalid');
            }

            const accessToken = TokenManager.generateAccessToken({
                id: payload.id,
                isAdmin: targetEmployee.isAdmin,
                // authorities,
            });
            const refreshToken = TokenManager.generateRefreshToken({
                id: payload.id,
            });

            return okResponse(res, {
                accessToken,
                refreshToken,
            })
        }
        return requestErrorResponse(res, 'Failed to generate refresh token!');

    } catch (err) {
        console.error(err);
        if (err instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return authenticationErrorResponse(res, 'Unable to validate refresh token!');
        }
        // otherwise, return a internal server error
        return internalErrorResponse(res, 'Unable to generate refresh token!');
    }
}