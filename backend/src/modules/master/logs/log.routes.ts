import express from "express";
import * as controller from "./log.controller"
import { verifyAuth } from "../../../middlewares"

export const authLogRoutes = express.Router();
// Create a new AuthLog
authLogRoutes.post('/auth/logs', [verifyAuth.isAdmin], controller.createAuthLog);
// Retreive all AuthLogs
authLogRoutes.get('/auth/logs/all', [verifyAuth.isAdmin], controller.getAllAuthLogs);
// Retreive all AuthLogs with pagination
authLogRoutes.get('/auth/logs', [verifyAuth.isAdmin], controller.getAllAuthLogWithPaginations);
// Retreive a single AuthLog with Id
authLogRoutes.get('/auth/logs/:id', [verifyAuth.isAdmin], controller.getAuthLogById);
// Update a AuthLog with Id
authLogRoutes.put('/auth/logs/:id', [verifyAuth.isAdmin], controller.updateAuthLog);
// Delete a AuthLog with Id
authLogRoutes.delete('/auth/logs/:id', [verifyAuth.isAdmin], controller.deleteAuthLog);

