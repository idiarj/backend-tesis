import { UserModel } from "../models/userModel.js";
import { User, LoginCredentials } from "../interfaces/user.interface.js";
import { responseSuccess } from "../interfaces/status.interface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { CryptManager } from "../security/CryptManager.js";


export class AuthService {

    constructor() {
    }

    static async registerUser(user: User){
        const { nom_usuario, pwd_usuario, email_usuario, tlf_usuario } = user;
        console.log("[AuthService] Registering user...");
        // TODO: Validate user data here with zod
        const existingUser = await UserModel.validateUser({ username: nom_usuario });
        console.log(existingUser)
        if (existingUser) {
            throw new ValidationError('User already exists', 400);
        }

        const existingEmail = await UserModel.validateEmail({ email: email_usuario });
        if (existingEmail) {
            throw new ValidationError('Email already registered', 400);
        }

        const hashedPassword = await CryptManager.hashPassword(pwd_usuario);

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
        return {
            success: true,
            message: "User logged in successfully"
        }
    }

}
