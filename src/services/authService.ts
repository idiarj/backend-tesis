import { UserModel } from "../models/userModel.js";
import { User, LoginCredentials } from "../interfaces/user.interface.js";
import { responseSuccess } from "../interfaces/status.interface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { HashManager } from "../security/HashManager.js";


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

        const hashedPassword = await HashManager.hashPassword({password: pwd_usuario});

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
        console.log(`[AuthService] Login user with credentials ${JSON.stringify(LoginCredentials)}`)
        const {nom_usuario, pwd_usuario} = LoginCredentials
        const valid = await UserModel.validateUser({username: nom_usuario})
        if(!valid){
            throw new ValidationError('Credenciales incorrectas.', 400, 'El nombre de usuario no esta registrado.');
        }
        const valid_pwd = await HashManager.verifyPassword({hashedPassword: valid?.pwd_usuario, password: pwd_usuario })
        if(!valid_pwd){
            throw new ValidationError('Credenciales incorrectas.', 400, 'La contrasena es incorrecta.')
        }
        return {
            success: true,
            message: "User logged in successfully",
            data: valid
        }
    }

}
