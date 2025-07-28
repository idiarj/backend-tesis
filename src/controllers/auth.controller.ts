

import { AuthService } from "../services/authService.js";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError.js";
import { userSchema } from "../interfaces/user.interface.js";

export class AuthController {
    static async register(req: Request, res: Response,  next: NextFunction) {
        try {
            const validation = userSchema.safeParse(req.body);
            if(!validation.success){
                throw new ValidationError('Error al validar los campos', 400, `Detalle del error`);
            }
            const {nom_usuario, email_usuario, pwd_usuario, tlf_usuario} = req.body;

            if(!nom_usuario || !email_usuario || !pwd_usuario || !tlf_usuario) {
                throw new ValidationError('All fields are required');
            }
            const result = await AuthService.registerUser({
                nom_usuario,
                email_usuario,
                pwd_usuario,
                tlf_usuario
            });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}