import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticationMidd } from "../middlewares/auth.middleware.js";


export const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post('/register', AuthController.register);
authRouter.post("/logout", authenticationMidd,AuthController.logout);
authRouter.post("/forgot-password", AuthController.verifyEmailForPasswordReset);
authRouter.get("/me", authenticationMidd, AuthController.getCurrentUser);
authRouter.put('/', authenticationMidd, AuthController.updateUser)
authRouter.patch("/reset-password", AuthController.resetPassword);