import { Request, Response, NextFunction } from "express";
import { Token } from "../security/token.js";
import { server_config } from "../configs/config.js";
import { SessionError } from "../errors/SessionError.js";
import { getLogger } from "../utils/logger.js";
import { User } from "../interfaces/user.interface.js";
import { UserModel } from "../models/userModel.js";

const logger = getLogger("AUTH_MIDDLEWARE");

export const authenticationMidd = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { access_token } = req.cookies;
        if(!access_token) throw new SessionError('Se debe tener una sesion activa para ejecutar esta accion.', 401, 'No access token provided in cookies.');
        const token = Token.verifyToken<User>({
            token: access_token,
            secret: server_config.ACCESS_TOKEN_SECRET ?? ''
        })
        if (typeof token.id_usuario !== "number") {
            throw new SessionError('Token inválido: id_usuario no definido.', 401, 'id_usuario is missing in token.');
        }
        const user = await UserModel.getUserById({ id_usuario: token.id_usuario });
        const userProfile = await UserModel.getUserProfile({ id_usuario: token.id_usuario });
        console.log(userProfile);
        // Map token payload to User type
        req.user = {
            id_usuario: token.id_usuario,
            img_usuario_url: user.img_usuario_url,
            nom_usuario: user.nom_usuario,
            email_usuario: user.email_usuario,
            tlf_usuario: user.tlf_usuario,
            ...userProfile
        };
        next();
    } catch (error) {
        if (error instanceof SessionError) {
            logger.warn(`Session error in authenticationMidd: ${error.message}`);
        } else {
            if (error instanceof Error) {
                logger.error(`Error in authenticationMidd: ${error.message}`);
            } else {
                logger.error(`Error in authenticationMidd: ${JSON.stringify(error)}`);
            }
        }
        next(error);
    }
}