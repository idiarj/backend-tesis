import { User, LoginCredentials } from "../interfaces/user.interface.js"
import { db } from "../instances/db.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { BaseError } from "../errors/BaseError.js";


export class UserModel {

    // private static db: any;

    // constructor() {
    //     UserModel.db = db; // Initialize the db instance
    // }


    static async insertUser({nom_usuario, pwd_usuario, email_usuario, tlf_usuario, id_perfil}: User): Promise<User> {
        try {
            console.log(`[UserModel] Inserting user ${nom_usuario}...`);
            const key = "registerUser";
            if(db.querys[key] === undefined) {
                console.error("[UserModel] Query for key not found:", key);
                throw new DatabaseError('Internal server error, please try again later', 500, `Query for key ${key} not found.`);
            }
            id_perfil = id_perfil || 1;
            const params = [nom_usuario, email_usuario, pwd_usuario, tlf_usuario, id_perfil];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                console.log("[UserModel] No rows returned from insert query");
                throw new DatabaseError("User registration failed", 500, "No rows returned from insert query");
            }
            return result.rows[0];
        } catch (error) {
            //console.error("[UserModel] Error inserting user:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async validateUser({ nom_usuario}: {nom_usuario: string}): Promise<User | null> {
        try {
            console.log("[UserModel] Validating user...");
            const key = "validateUser";

            const params = [nom_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            return result.rows[0]; // Return the found user
        } catch (error) {
            //console.error("[UserModel] Error validating user:", error);
            if (error instanceof BaseError) {
                //console.error("[UserModel] Database error:", error);
                throw error;
            } else if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error: ' + error.message);
            }
            return null; // Fallback in case of unexpected error
        }
    }

    static async validateEmail({ email }: { email: string }): Promise<User | null> {
        try {
            console.log("[UserModel] Validating email...");
            const key = "validateEmail";

            const params = [email];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            return result.rows[0]; // Return the found user
        } catch (error) {
            //console.error("[UserModel] Error validating email:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async checkCredentials({ identifier_usuario, pwd_usuario }: LoginCredentials): Promise<User | null> {
        try {
            console.log("[UserModel] Checking user credentials...");
            const key = "checkUserCredentials";

            const params = [identifier_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            console.log("[UserModel] User credentials found:", result.rows[0]);
            return result.rows[0]; // Return the found user
        } catch (error) {
            console.error("[UserModel] Error checking credentials:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async getUserById({id_usuario}: { id_usuario: number }): Promise<User | null> {
        try {
            console.log("[UserModel] Fetching user by ID...");
            const key = "getUserById";

            const params = [id_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            return result.rows[0]; // Return the found user
        } catch (error) {
            //console.error("[UserModel] Error fetching user by ID:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async updateUser({nom_usuario, pwd_usuario, email_usuario, tlf_usuario}: User): Promise<User> {
        try {
            console.log("[UserModel] Updating user...");
            const key = "updateUser";

            const params = [nom_usuario, email_usuario, pwd_usuario, tlf_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                throw new Error("User update failed");
            }
            return result.rows[0]; // Return the updated user
        } catch (error) {
            //console.error("[UserModel] Error updating user:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async deleteUser({id_usuario}: { id_usuario: number }): Promise<void> {
        try {
            console.log("[UserModel] Deleting user...");
            const key = "deleteUser";
            const params = [id_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rowCount === 0) {
                throw new Error("User deletion failed");
            }
            console.log("[UserModel] User deleted successfully");
        } catch (error) {
            //console.error("[UserModel] Error deleting user");
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async updatePassword({email_usuario, id_token, newPassword}: { email_usuario: string, id_token: number, newPassword: string }): Promise<void> {
        const client = await db.beginTransaction();
        try {
            console.log("[UserModel] Updating user password...");

            const key1 = "updatePassword";
            const key2 = 'updatePasswordRecoveryTokenUsage';

            const params1 = [newPassword, email_usuario];
            const params2 = [id_token]

            await db.executeQuery({ queryKey: key1, params: params1, client });
            await db.executeQuery({queryKey: key2, params: params2, client})
            console.log("[UserModel] Password updated successfully");
            await db.commitTransaction(client); 
        } catch (error) {
            //console.error("[UserModel] Error updating user password:", error);
            await db.rollbackTransaction(client);
            if (error instanceof BaseError) {
                throw error;
            } else if(error instanceof Error){

                throw new DatabaseError('Internal server error, please try again later', 500, error.message || 'Unknown error');
            }
        }
    }

    static async verifyPasswordRecoveryToken({email_usuario}: {email_usuario: string}){
        const client = await db.beginTransaction();
        try {
            console.log("[UserModel] Verifying password recovery for email:", email_usuario);
            const resultRawQuery = await db.executeRawQuery(`SELECT id_usuario FROM usuario WHERE email_usuario = $1`, [email_usuario], client);
            if (resultRawQuery.rows.length === 0) {
                console.log("[UserModel] No user found with the provided email.");
                return null; // No user found with the provided email
            }
            console.log(`[UserModel] User found with the provided email: ${JSON.stringify(resultRawQuery.rows[0])}`);
            const {id_usuario} = resultRawQuery.rows[0];
            console.log("[UserModel] User found:", id_usuario);
            // Now check for the password recovery token
            const key = "verifyPasswordRecoveryToken";
            const params = [id_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No token found
            }
            await db.commitTransaction(client);
            return result.rows; // Return the user associated with the token
        } catch (error) {
            await db.releaseConnection(client);
            if(error instanceof BaseError) {
                throw error;
            }else if(error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message || 'Unknown error');
            }
        }
    }

    static async insertPasswordRecoveryToken({id_usuario, password_recovery_token}: { id_usuario: number | undefined, password_recovery_token: string }): Promise<void> {
        try {
            console.log("[UserModel] Inserting password recovery token...");
            const key = "insertPasswordRecoveryToken";
            console.log(`[UserModel] Token that is going to be inserted in the DB: ${password_recovery_token}`);
            const params = [id_usuario, password_recovery_token];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rowCount === 0) {
                throw new DatabaseError("Internal Server Error: Password recovery token insertion failed", 500, "No rows affected during token insertion");
            }
            console.log("[UserModel] Password recovery token inserted successfully");
        } catch (error) {
            //console.error("[UserModel] Error inserting password recovery token:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }
}