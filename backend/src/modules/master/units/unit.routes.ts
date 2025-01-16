import express from "express";
import * as controller from "./unit.controller"
import { verifyAuth } from "../../../middlewares"

export const unitRoutes = express.Router();
// Create a new Unit
unitRoutes.post('/master/units', [verifyAuth.isAdmin], controller.createUnit);
// Retreive all Units
unitRoutes.get('/master/units/all', [verifyAuth.isAuthenticated], controller.getAllUnits);
// Retreive all Units with pagination
unitRoutes.get('/master/units', [verifyAuth.isAuthenticated], controller.getAllUnitWithPaginations);
// Retreive a single Unit with Id
unitRoutes.get('/master/units/:id', [verifyAuth.isAuthenticated], controller.getUnitById);
// Retreive a single Unit by name
unitRoutes.get('/master/units/name/:name', [verifyAuth.isAuthenticated], controller.getUnitByName);
// Update a Unit with Id
unitRoutes.put('/master/units/:id', [verifyAuth.isAdmin], controller.updateUnit);
// Delete a Unit with Id
unitRoutes.delete('/master/units/:id', [verifyAuth.isAdmin], controller.deleteUnit);

