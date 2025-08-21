import { UserModel } from "../models/userModel.js";
import { User, LoginCredentials } from "../interfaces/user.interface.js";
import { responseSuccess } from "../interfaces/status.interface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { HashManager } from "../security/HashManager.js";
import { mail } from "../instances/mail.js";
import { getPwdRecoverEmailTemp } from "../utils/getMailTemplate.js";
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
            throw new AuthError(`Credenciales incorrectas.`, 401, `User with identifier ${identifier_usuario} not found.`);
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
            throw new ValidationError('El correo ingresado no esta registrado.', 404);
        }

        const hashedToken = await HashManager.hashData({data: password_recovery_token});
        await UserModel.insertPasswordRecoveryToken({
            id_usuario: user.id_usuario,
            password_recovery_token: hashedToken
        })

        await mail.sendTemplate({
            from: `idiar16@gmail.com`,
            subject: 'Password Recovery',
            html: getPwdRecoverEmailTemp({
                frontURL: `http://localhost:5173`,
                token: password_recovery_token
            }),
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
