import { UserModel } from "../models/userModel.js";
import { User, LoginCredentials } from "../interfaces/user.interface.js";
import { responseSuccess } from "../interfaces/status.interface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { HashManager } from "../security/HashManager.js";
import { mail } from "../instances/mail.js";
import { InternalError } from "../errors/InternalError.js";
import { JsonWebTokenError } from "../errors/JsonWebTokenError.js";


export class AuthService {

    constructor() {
    }

    static async registerUser(user: User){
        const { nom_usuario, pwd_usuario, email_usuario, tlf_usuario } = user;
        console.log("[AuthService] Registering user...");
        // TODO: Validate user data here with zod
        const existingUser = await UserModel.validateUser({ nom_usuario });
        console.log(existingUser)
        if (existingUser) {
            throw new ValidationError('User already exists', 400);
        }

        const existingEmail = await UserModel.validateEmail({ email: email_usuario });
        if (existingEmail) {
            throw new ValidationError('Email already registered', 400);
        }

        const hashedPassword = await HashManager.hashData({data: pwd_usuario});

        console.log("[AuthService] User and email do not exist, proceeding with registration...");

        await UserModel.insertUser({
            nom_usuario,
            pwd_usuario: hashedPassword,
            email_usuario,
            tlf_usuario
        });
        return {
            success: true,
            message: "User registered successfully",
        };
    }

    static async loginUser(LoginCredentials: LoginCredentials): Promise<responseSuccess>{
        // TODO: Login implementation
        const { identifier_usuario, pwd_usuario } = LoginCredentials;
        console.log("[AuthService] Validating user credentials...");
        const credentials = await UserModel.checkCredentials({ identifier_usuario, pwd_usuario });
        //console.log("[AuthService] User credentials:", credentials);
        if (!credentials) {
            throw new ValidationError('Credenciales incorrectas', 401, `User with identifier ${identifier_usuario} not found.`);
        }
        const validPwd = await HashManager.verifyData({
            hashedData: credentials.pwd_usuario,
            data: pwd_usuario
        })
        if (!validPwd) {
            throw new ValidationError('Credenciales incorrectas', 401, `Invalid password for user with identifier ${identifier_usuario}`);
        }
        return {
            success: true,
            message: "User logged in successfully",
            data: credentials
        }
    }

    static async verifyEmailForPasswordReset({email, password_recovery_token}: { email: string , password_recovery_token: string}): Promise<responseSuccess> {
        console.log(`[AuthService] Verifying email: ${email}`);
        const user = await UserModel.validateEmail({ email });
        if (!user) {
            throw new ValidationError('Email not registered', 404);
        }
        console.log(`[AuthService] User found: ${user}`);
        const hashedToken = await HashManager.hashData({data: password_recovery_token});
        await UserModel.insertPasswordRecoveryToken({
            id_usuario: user.id_usuario,
            password_recovery_token: hashedToken
        })

        // await mail.sendTemplate({
        //     from: `idiar16@gmail.com`,
        //     subject: 'Password Recovery',
        //     html: `<p>Click <a href="http://localhost:5173/reset-password?token=${password_recovery_token}">here</a> to reset your password.</p>`,
        //     attachments: [],
        //     to: email,
        // });

        return {success: true, message: "Email verified successfully"};
    }


    static async resetPassword({email_usuario, token, newPassword}: { email_usuario: string, token: string, newPassword: string}): Promise<responseSuccess> {
        console.log(`[AuthService] Resetting password with token: ${token}`);
        const tokens = await UserModel.verifyPasswordRecoveryToken({ email_usuario });
        console.log(`[AuthService] Tokens found: ${JSON.stringify(tokens)}`);
        if(!tokens || tokens.length === 0) {
            throw new ValidationError('Invalid or expired token', 400, 'No valid token found for the provided email.');
        }
        const [{id_token_recup, token_hash} = {}] = tokens;
        const isTokenValid = await HashManager.verifyData({hashedData: token_hash, data: token});
        console.log(`[AuthService] Is token valid? ${isTokenValid}`);
        if (!isTokenValid) {
            throw new ValidationError('Invalid or expired token', 400, 'The provided token is invalid or has expired.');
        }


        console.log(`[AuthService] Tokens found: ${JSON.stringify(tokens)}`);
        if (!tokens || tokens.length === 0) {
            throw new ValidationError('Invalid or expired token', 400, 'No valid token found for the provided token.');
        }
        const hashedPassword = await HashManager.hashData({data: newPassword});

        await UserModel.updatePassword({
            email_usuario,
            newPassword: hashedPassword,
            id_token: id_token_recup
        });
        return {success: true, message: "Password reset successfully"};
    }
}
