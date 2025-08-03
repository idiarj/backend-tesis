

import { AuthService } from "../services/authService.js";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError.js";
import { userSchema } from "../interfaces/user.interface.js";
import { Token } from "../security/token.js";
import { server_config } from "../configs/config.js";
import { SessionError } from "../errors/SessionError.js";
import { InternalError } from "../errors/InternalError.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger('AuthController');

export class AuthController {
    static async register(req: Request, res: Response,  next: NextFunction){
        try {
            const {nom_usuario, email_usuario, pwd_usuario, tlf_usuario} = req.body;
            logger.info(`Registering user: ${nom_usuario}`);
            const validation = userSchema.safeParse(req.body);
            if(!validation.success){
                throw new ValidationError('Error al validar los campos', 400, `Detalle del error`);
            }

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
            console.log("[AuthController] Logging in user...");
            console.log(req.body);
            const { identifier_usuario, pwd_usuario } = req.body;
            if (!identifier_usuario || !pwd_usuario) {
                throw new ValidationError('Username and password are required', 400);
            }
            logger.info(`Logging in user: ${identifier_usuario}`);
            const result = await AuthService.loginUser({ identifier_usuario, pwd_usuario });
            if(result.success && result.data && typeof result.data === 'object'){
                const { pwd_usuario, ...userData } = result.data as { pwd_usuario?: string; [key: string]: any };
                token = Token.generateToken({payload: userData ?? {}, secret: server_config.ACCESS_TOKEN_SECRET ?? "", options: {expiresIn: '3h'}})
                res.cookie('access_token', token, {maxAge: 60 * 60 * 60 * 3})
            }
            const { data, ...rest } = result
            logger.info(`Login successful for user: ${identifier_usuario}`);
            res.status(200).json(rest);
            return;
        } catch (error) {
            //console.error("[AuthController] Error during login:", error);
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction){
        try {
            const {access_token} = req.cookies;
            logger.info("Logging out user...");
            if(!access_token){
                throw new SessionError('No hay una sesion activa', 401, 'No access token found in cookies');
            }

            res.clearCookie('access_token');
            res.status(200).json({
                success: true,
                message: 'Sesión cerrada correctamente'
            })
            logger.info("User logged out successfully.");
        } catch (error) {
            next(error)
        }
    }

    static async verifyEmailForPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('Verifying email for password reset...');
            const { email_usuario } = req.body;
            if (!email_usuario) {
                throw new ValidationError('Email is required', 400);
            }
            
            
            const token = Token.generateToken({
                payload: { email_usuario },
                secret: server_config.RECOVER_PASSWORD_TOKEN_SECRET ?? "",
                options: { expiresIn: '15min' }
            })
            const result = await AuthService.verifyEmailForPasswordReset({ email: email_usuario, password_recovery_token: token });
            logger.info(`Password recovery token generated for email: ${email_usuario}`);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('Resetting password for user...');
            console.log(req.body);
            const { token, newPassword } = req.body;
            const secret = server_config.RECOVER_PASSWORD_TOKEN_SECRET
            if(!secret){
                throw new InternalError('Internal server error, please try again later.', 500, 'JWT secret for password recovery token is not defined.');
            }
            logger.debug(`Token received: ${token}`);
            const decoded = Token.verifyToken({token, secret})
            logger.debug(`Decoded token: ${JSON.stringify(decoded)}`);
            if (!token || !newPassword) {
                throw new ValidationError('All fields are required', 400, 'Token and new password are required');
            }
            const result = await AuthService.resetPassword({ email_usuario: decoded.email_usuario, token, newPassword });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}