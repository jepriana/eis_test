import express from "express";
import * as controller from "./auth.controller"
import { verifyRegistration } from "../../middlewares"

export const authRoutes = express.Router();
// Register a new User
authRoutes.post(
    '/auth/register', 
    verifyRegistration.checkDuplicateUsername, 
    controller.register
);
// User Login
authRoutes.post('/auth/login', controller.login);
// User Refresh Token
authRoutes.post('/auth/refresh-token', controller.refreshToken);

