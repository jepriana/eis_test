import express from "express";
import * as controller from "./role.controller"
import { verifyAuth } from "../../../middlewares"

export const roleRoutes = express.Router();
// Create a new Role
roleRoutes.post('/master/roles', [verifyAuth.isAdmin], controller.createRole);
// Retreive all Roles
roleRoutes.get('/master/roles/all', [verifyAuth.isAuthenticated], controller.getAllRoles);
// Retreive all Roles with pagination
roleRoutes.get('/master/roles', [verifyAuth.isAuthenticated], controller.getAllRoleWithPaginations);
// Retreive a single Role with Id
roleRoutes.get('/master/roles/:id', [verifyAuth.isAuthenticated], controller.getRoleById);
// Retreive a single Role by name
roleRoutes.get('/master/roles/name/:name', [verifyAuth.isAuthenticated], controller.getRoleByName);
// Update a Role with Id
roleRoutes.put('/master/roles/:id', [verifyAuth.isAdmin], controller.updateRole);
// Delete a Role with Id
roleRoutes.delete('/master/roles/:id', [verifyAuth.isAdmin], controller.deleteRole);

