import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post('/register', AuthController.register);
authRouter.post("/logout", authMiddleware,AuthController.logout);
authRouter.get("/me", authMiddleware, AuthController.getCurrentUser);

authRouter.post("/forgot-password", AuthController.verifyEmailForPasswordReset);
authRouter.patch("/reset-password", AuthController.resetPassword);