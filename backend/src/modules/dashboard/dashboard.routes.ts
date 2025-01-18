import express from "express";
import * as controller from "./dashboard.controller"
import { verifyAuth } from "../../middlewares"

export const dashboardRoutes = express.Router();
// Retreive dashboard summary
dashboardRoutes.get('/dashboard', [verifyAuth.isAuthenticated], controller.getDashboardSummary);