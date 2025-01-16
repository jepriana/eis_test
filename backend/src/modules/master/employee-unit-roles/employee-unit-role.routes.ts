import express from "express";
import * as controller from "./employee-unit-role.controller"
import { verifyAuth } from "../../../middlewares"

export const employeeUnitRoleRoutes = express.Router();
// Create a new institution user
employeeUnitRoleRoutes.post('/master/unit-roles', [verifyAuth.isAdmin], controller.createEmployeeUnitRole);
// Retreive all institution users
employeeUnitRoleRoutes.get('/master/unit-roles/all', [verifyAuth.isAdmin], controller.getAllEmployeeUnitRoles);
// Retreive all institution users with pagination
employeeUnitRoleRoutes.get('/master/unit-roles', [verifyAuth.isAdmin], controller.getAllEmployeeUnitRoleWithPaginations);
// Retreive a single institution user with Id
employeeUnitRoleRoutes.get('/master/unit-roles/:employeeUnitRoleId', [verifyAuth.isAdmin], controller.getEmployeeUnitRoleById);
// Update a institution user with Id
employeeUnitRoleRoutes.put('/master/unit-roles/:employeeUnitRoleId', [verifyAuth.isAdmin], controller.updateEmployeeUnitRole);
// Delete a institution user with Id
employeeUnitRoleRoutes.delete('/master/unit-roles/:employeeUnitRoleId', [verifyAuth.isAdmin], controller.deleteEmployeeUnitRole);
