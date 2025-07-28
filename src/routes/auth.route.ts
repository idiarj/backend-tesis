import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();

// authRouter.post("/login", callbackLogin);
authRouter.post("/register", AuthController.register);
// authRouter.post("/logout", callbackLogout);
// authRouter.post("/forgot-password", callbackForgotPassword);
// authRouter.post("/reset-password", callbackResetPassword);