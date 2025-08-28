import { AuthService } from "../services/authService.js";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError.js";
import { userSchema, loginCredentialsSchema } from "../interfaces/user.interface.js";
import { Token } from "../security/token.js";
import { server_config } from "../configs/config.js";
import { SessionError } from "../errors/SessionError.js";
import { InternalError } from "../errors/InternalError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { getLogger } from "../utils/logger.js";
import { validateSchema } from "../utils/validation.js";

const logger = getLogger('AuthController');

export class AuthController {
    static async register(req: Request, res: Response,  next: NextFunction){
        try {
            const {nom_usuario, email_usuario, pwd_usuario, tlf_usuario} = req.body;
            logger.info(`Registering user: ${nom_usuario}`);
            const validation = validateSchema({
                schema: userSchema,
                data: req.body
            })
            if(!validation.success){
                const firstMessage = validation.error
                logger.debug(`Validation result: ${JSON.stringify(firstMessage)}`);
                throw new ValidationError(firstMessage, 400, `Error al validar los campos con Zod: ${firstMessage}`);
            }

            // if(!nom_usuario || !email_usuario || !pwd_usuario || !tlf_usuario) {
            //     throw new ValidationError('All fields are required', 50);
            // }
            const result = await AuthService.registerUser({
                nom_usuario,
                email_usuario,
                pwd_usuario,
                tlf_usuario,
                img_usuario_url: 'https://res.cloudinary.com/dqc0yku26/image/upload/v1756355363/gatoFeliz/icons/cat_orange_cat.png'
            });


            res.status(201).json(result);
            return;
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Attempting to log in user...");
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);
            if(req.cookies.access_token){
                logger.warn('User is already logged in, cannot login again.');
                throw new SessionError('Ya hay una sesion activa, por favor cierra sesion para iniciar sesion nuevamente.', 401, 'Cannot login while session is active');
            }

            const { identifier_usuario, pwd_usuario } = req.body;
            logger.info(`Logging in user: ${identifier_usuario}`);
            const validation = validateSchema({
                schema: loginCredentialsSchema,
                data: req.body
            })
            if(!validation.success){
                const firstMessage = validation.error
                logger.debug(`Validation result: ${JSON.stringify(firstMessage)}`);
                throw new ValidationError(firstMessage, 400, `Error al validar los campos con Zod: ${firstMessage}`);
            }

            const result = await AuthService.loginUser({ identifier_usuario, pwd_usuario });
            let userData;
            if(result.success && result.data && typeof result.data === 'object'){
                const { pwd_usuario, ...restData } = result.data as { pwd_usuario?: string; [key: string]: any };
                userData = restData;
                const token = Token.generateToken({payload: userData ?? {}, secret: server_config.ACCESS_TOKEN_SECRET ?? "", options: {expiresIn: '3h'}})
                res.cookie('access_token', token, {
                    maxAge: 60 * 60 * 60 * 3, 
                    sameSite: server_config.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: server_config.NODE_ENV === 'production',
                })
            }
            logger.debug(`Login result: ${JSON.stringify(userData)}`);
            logger.info(`Login successful for user: ${identifier_usuario}`);
            res.status(200).json({ success: result.success, message: result.message, data: userData });
            return;
        } catch (error) {
            //console.error("[AuthController] Error during login:", error);
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction){
        try {
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
            if(req.cookies.access_token){
                logger.warn('User is already logged in, cannot verify email for password reset.');
                throw new SessionError('Ya hay una sesion activa, por favor cierra sesion para recuperar tu contrasena.', 401, 'Cannot verify email for password reset while logged in');
            }

            logger.info('Verifying email for password reset...');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);
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
            if(req.cookies.access_token){
                logger.warn('User is already logged in, cannot reset password.');
                throw new SessionError('Ya hay una sesion activa, por favor cierra sesion para recuperar tu contrasena.', 401, 'Cannot verify email for password reset while logged in');
            }
            logger.info('Resetting password for user...');
            console.log(req.body);
            const { token, newPassword } = req.body;
            if (!token) {
                throw new ForbiddenError('No estas autorizado para realizar esta accion.', 403, 'Token and new password are required');
            }
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

    static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('Retrieving current user...');
            const { access_token } = req.cookies;
            logger.debug(`${JSON.stringify(req.user)}`);
            logger.debug(`Access token received: ${access_token}`);
            
            res.status(200).json({
                success: true,
                message: 'Current user retrieved successfully',
                data: req.user || null
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction){
        try {
            logger.info('Updating current user info...');
            const {id_usuario, nom_usuario, tlf_usuario, email_usuario, img_usuario_url } = req.body
            logger.debug(`Body of the request on: ${JSON.stringify(req.body)}`)
            const result = await AuthService.updateUser({id_usuario, nom_usuario, email_usuario, tlf_usuario, img_usuario_url });
            // const result = {
            //     mock: true,
            //     message: 'Actualizacion de usuario exitosa.'
            // }

            if(result.success && result.data){
                const userData = result.data as { id_usuario: number; nom_usuario: string; email_usuario: string; tlf_usuario: string; img_usuario_url: string };
                req.user = {
                    img_usuario_url: userData.img_usuario_url,
                    id_usuario: userData.id_usuario,
                    nom_usuario: userData.nom_usuario,
                    email_usuario: userData.email_usuario,
                    tlf_usuario: userData.tlf_usuario
                }
            }
            logger.debug(`Update result: ${JSON.stringify(req.user)}`);

            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}