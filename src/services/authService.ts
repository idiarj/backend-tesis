import { UserModel } from "../models/userModel.js";
import { User, LoginCredentials } from "../interfaces/user.interface.js";
import { responseSuccess } from "../interfaces/status.interface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { HashManager } from "../security/HashManager.js";
import { mail } from "../instances/mail.js";
import { mail_config } from "../configs/config.js";
import { getLogger } from "../utils/logger.js";
import { AuthError } from "../errors/AuthError.js";

const logger = getLogger('AuthService')

export class AuthService {

    static async registerUser(user: User){
        const { nom_usuario, pwd_usuario, email_usuario, tlf_usuario } = user;
        logger.info('Registering user...');
        // TODO: Validate user data here with zod
        const existingUser = await UserModel.validateUser({ nom_usuario });
        console.log(existingUser)
        if (existingUser) {
            throw new AuthError('User already exists', 400, 'Username already registered');
        }

        const existingEmail = await UserModel.validateEmail({ email: email_usuario });
        if (existingEmail) {
            throw new AuthError('Email already registered', 400, 'Email already associated with an account');
        }

        const existingPhone = await UserModel.validatePhoneNumber({ tlf_usuario });
        if (existingPhone) {
            throw new AuthError('Phone number already registered', 400, 'Phone number already associated with an account');
        }
        logger.debug(`User ${nom_usuario}, email ${email_usuario} and phone ${tlf_usuario} are not already registered, proceeding with registration...`);

        const hashedPassword = await HashManager.hashData({data: pwd_usuario});

        await UserModel.insertUser({
            nom_usuario,
            pwd_usuario: hashedPassword,
            email_usuario,
            tlf_usuario
        });

        logger.info(`Registration of user ${nom_usuario} was successfull, yay :)`);
        return {
            success: true,
            message: "User registered successfully",
        };
    }

    static async loginUser(LoginCredentials: LoginCredentials): Promise<responseSuccess>{
        // TODO: Login implementation
        const { identifier_usuario, pwd_usuario } = LoginCredentials;
        logger.info(`Starting login process for user: ${identifier_usuario}`);
        const credentials = await UserModel.checkCredentials({ identifier_usuario, pwd_usuario });
        if (!credentials) {
            throw new AuthError('Credenciales incorrectas', 401, `User with identifier ${identifier_usuario} not found.`);
        }
        const validPwd = await HashManager.verifyData({
            hashedData: credentials.pwd_usuario,
            data: pwd_usuario
        })
        if (!validPwd) {
            throw new AuthError('Credenciales incorrectas', 401, `Invalid password for user with identifier ${identifier_usuario}`);
        }
        logger.info(`User ${identifier_usuario} logged in successfully.`);
        return {
            success: true,
            message: "User logged in successfully",
            data: credentials
        }
    }

    static async verifyEmailForPasswordReset({email, password_recovery_token}: { email: string , password_recovery_token: string}): Promise<responseSuccess> {
        logger.info(`Verifying email for password reset: ${email}`);
        const user = await UserModel.validateEmail({ email });
        if (!user) {
            throw new ValidationError('Email not registered', 404);
        }

        const hashedToken = await HashManager.hashData({data: password_recovery_token});
        await UserModel.insertPasswordRecoveryToken({
            id_usuario: user.id_usuario,
            password_recovery_token: hashedToken
        })

        await mail.sendTemplate({
            from: `idiar16@gmail.com`,
            subject: 'Password Recovery',
            html: ` <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8" />
                        <title>Recuperar contraseña - Gato Feliz</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #fff9db; font-family: Arial, sans-serif;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="padding: 40px 10px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                <td align="center" style="background-color: #fff9db; padding: 20px;">
                                    <img src="https://res.cloudinary.com/dqc0yku26/image/upload/v1754523931/logogf2_zv8jnt.png" alt="Logo Gato Feliz" width="80" height="80" style="display:block;" />
                                    <h2 style="margin: 10px 0 0; color: #F37021;">Recuperar tu contraseña</h2>
                                </td>
                                </tr>

                                <!-- Cuerpo -->
                                <tr>
                                <td style="padding: 30px 40px; color: #333;">
                                    <p style="font-size: 16px; margin: 0 0 12px;">
                                    ¡Hola! Hemos recibido una solicitud para restablecer tu contraseña en <strong>Gato Feliz Venezuela</strong>.
                                    </p>
                                    <p style="font-size: 15px; margin: 0 0 20px;">
                                    Para continuar, haz clic en el botón de abajo. Este enlace es válido por 30 minutos.
                                    </p>

                                    <!-- Botón -->
                                    <table role="presentation" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" style="border-radius: 30px;" bgcolor="#F37021">
                                        <a
                                            href="http://localhost:5173/NewPassword?token=${password_recovery_token}"
                                            target="_blank"
                                            style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 30px;"
                                        >
                                            Restablecer Contraseña
                                        </a>
                                        </td>
                                    </tr>
                                    </table>

                                    <p style="font-size: 13px; color: #999; margin-top: 24px;">
                                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual seguirá funcionando.
                                    </p>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td align="center" style="background-color: #fff9db; padding: 16px; font-size: 13px; color: #666;">
                                    Fundación Gato Feliz Venezuela 🐾<br />
                                    Síguenos en Instagram: <strong>@gatofelizvenezuela</strong>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </body>
                    </html>`,
            attachments: [],
            to: email,
        });
        logger.info(`Password recovery email sent to ${email}`);
        return {success: true, message: "Email verified successfully"};
    }


    static async resetPassword({email_usuario, token, newPassword}: { email_usuario: string, token: string, newPassword: string}): Promise<responseSuccess> {
        logger.info(`Resetting password for user: ${email_usuario}`);
        const tokens = await UserModel.verifyPasswordRecoveryToken({ email_usuario });
        logger.debug(`Tokens found: ${JSON.stringify(tokens)}`);
        if(!tokens || tokens.length === 0) {
            throw new ValidationError('Invalid or expired token', 400, 'No valid token found for the provided email.');
        }
        const [{id_token_recup, token_hash} = {}] = tokens;
        logger.debug(`Token ID: ${id_token_recup}, Token Hash: ${token_hash}`);
        logger.debug(`Token to verify: ${token}`);
        const isTokenValid = await HashManager.verifyData({
            hashedData: token_hash,
            data: token
        });
        logger.debug(`Is token valid? ${isTokenValid}`);
        if (!isTokenValid) {
            throw new ValidationError('Invalid or expired token', 400, 'The provided token is invalid or has expired.');
        }


        logger.debug(`Tokens found: ${JSON.stringify(tokens)}`);
        if (!tokens || tokens.length === 0) {
            throw new ValidationError('Invalid or expired token', 400, 'No valid token found for the provided token.');
        }
        const hashedPassword = await HashManager.hashData({data: newPassword});

        await UserModel.updatePassword({
            email_usuario,
            newPassword: hashedPassword,
            id_token: id_token_recup
        });
        logger.info(`Password reset successfully for user: ${email_usuario}`);
        
        return {success: true, message: "Password reset successfully"};
    }
}
