

import { AuthService } from "../services/authService.js";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError.js";
import { userSchema } from "../interfaces/user.interface.js";
import { Token } from "../security/token.js";
import { server_config } from "../configs/config.js";
import { SessionError } from "../errors/SessionError.js";

export class AuthController {
    static async register(req: Request, res: Response,  next: NextFunction){
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
            return;
        } catch (error) {
            next(error);
        }
    }


    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            let token;
            const { nom_usuario, pwd_usuario } = req.body;
            if (!nom_usuario || !pwd_usuario) {
                throw new ValidationError('Username and password are required', 400);
            }
            const result = await AuthService.loginUser({ nom_usuario, pwd_usuario });
            if(result.success && result.data && typeof result.data === 'object'){
                const { pwd_usuario, ...userData } = result.data as { pwd_usuario?: string; [key: string]: any };
                token = Token.generateToken({payload: userData ?? {}, secret: server_config.ACCESS_TOKEN_SECRET ?? "", options: {expiresIn: '3h'}})
                res.cookie('access_token', token, {maxAge: 60 * 60 * 60 * 3})
            }
            const { data, ...rest } = result
            res.status(200).json(rest);
            return;
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction){
        try {
            const {access_token} = req.cookies;
            if(!access_token){
                throw new SessionError('No hay una sesion activa', 401, 'No access token found in cookies');
            }

            res.clearCookie('access_token');
            res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            })
            
        } catch (error) {
            next(error)
        }
    }

}