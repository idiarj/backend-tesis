import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post('/register', AuthController.register);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/me", AuthController.getCurrentUser);

authRouter.post("/forgot-password", AuthController.verifyEmailForPasswordReset);
authRouter.post("/reset-password", AuthController.resetPassword);