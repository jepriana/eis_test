import express from "express";
import * as controller from "./employee.controller"
import { verifyAuth, verifyUser } from "../../../middlewares"

export const employeeRoutes = express.Router();
// Create a new Employee
employeeRoutes.post('/employees', [verifyAuth.isAdmin], controller.createEmployee);
// Retreive all Employees
employeeRoutes.get('/employees/all', [verifyAuth.isAdmin], controller.getAllEmployees);
// Retreive all Employees with pagination
employeeRoutes.get('/employees', [verifyAuth.isAuthenticated], controller.getAllEmployeeWithPaginations);
// Retreive a single Employee with Id
employeeRoutes.get('/employees/:employeeId', [verifyAuth.isAuthenticated, verifyUser.isOwner], controller.getEmployeeById);
// Retreive a single Employee with username
employeeRoutes.get('/employees/:username', [verifyAuth.isAdmin], controller.getEmployeeByUsername);
// Update a Employee with Id
employeeRoutes.put('/employees/:employeeId', [verifyAuth.isAdmin], controller.updateEmployee);
// Delete a Employee with Id
employeeRoutes.delete('/employees/:employeeId', [verifyAuth.isAdmin], controller.deleteEmployee);

