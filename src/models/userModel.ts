import { User, LoginCredentials } from "../interfaces/user.interface.js"
import { db } from "../instances/db.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { BaseError } from "../errors/BaseError.js";
import { getLogger } from "../utils/logger.js";
import { UserPermissions } from "../interfaces/authorization.interface.js";

const logger = getLogger('USER');

export class UserModel {
    static async insertUser({nom_usuario, pwd_usuario, email_usuario, tlf_usuario, id_perfil}: User): Promise<User> {
        try {
            logger.debug(`Inserting user ${nom_usuario} into the database...`);
            const key = "registerUser";
            id_perfil = id_perfil || 1;
            const params = [nom_usuario, email_usuario, pwd_usuario, tlf_usuario, id_perfil];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                throw new DatabaseError("User registration failed", 500, "No rows returned from insert query");
            }
            // Convert perfil string to Perfil enum/type
            return {
                ...result.rows[0],
                perfil: result.rows[0].perfil as UserPermissions["perfil"]
            };
        } catch (error) {
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async validateUser({ nom_usuario}: {nom_usuario: string}) {
        try {
            logger.debug(`Validating user ${nom_usuario}...`);
            const key = "validateUser";

            const params = [nom_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            logger.debug(`User ${nom_usuario} found: ${JSON.stringify(result.rows[0])}`);
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
            logger.debug(`Validating email ${email}...`);
            const key = "validateEmail";

            const params = [email];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            logger.debug(`Email ${email} found: ${JSON.stringify(result.rows[0])}`);
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

    static async validatePhoneNumber({ tlf_usuario }: { tlf_usuario: string }) {
        try {
            logger.debug(`Validating phone number ${tlf_usuario}...`);
            const key = "validatePhoneNumber";

            const params = [tlf_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            logger.debug(`Phone number ${tlf_usuario} found: ${JSON.stringify(result.rows[0])}`);
            return result.rows[0]; // Return the found user
        } catch (error) {
            if(error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async checkCredentials({ identifier_usuario, pwd_usuario }: LoginCredentials): Promise<User | null> {
        try {
            logger.debug(`Checking credentials for user ${identifier_usuario}...`);
            const key = "checkUserCredentials";

            const params = [identifier_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            logger.debug(`User credentials found for ${identifier_usuario}: ${JSON.stringify(result.rows[0])}`);
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
            logger.debug(`Fetching user by ID: ${id_usuario}`);
            const key = "getUserById";

            const params = [id_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            logger.debug(`User found by ID ${id_usuario}: ${JSON.stringify(result.rows[0])}`);
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
            logger.debug(`Updating user ${nom_usuario}...`);
            const key = "updateUser";

            const params = [nom_usuario, email_usuario, pwd_usuario, tlf_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                throw new DatabaseError('Internal server error, please try again later', 500, "User update failed");
            }
            logger.debug(`User ${nom_usuario} updated successfully: ${JSON.stringify(result.rows[0])}`);
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
            logger.debug(`Deleting user ${id_usuario}...`);
            const key = "deleteUser";
            const params = [id_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rowCount === 0) {
                throw new Error("User deletion failed");
            }
            logger.debug(`User ${id_usuario} deleted successfully`);
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
            logger.debug(`Updating user password for email: ${email_usuario}...`);

            const key1 = "updatePassword";
            const key2 = 'updatePasswordRecoveryTokenUsage';

            const params1 = [newPassword, email_usuario];
            const params2 = [id_token]

            await db.executeQuery({ queryKey: key1, params: params1, client });
            await db.executeQuery({queryKey: key2, params: params2, client})
            logger.debug(`Password updated successfully for email: ${email_usuario}`);
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
            logger.debug(`Verifying password recovery for email: ${email_usuario}`);
            const resultRawQuery = await db.executeRawQuery({ query: `SELECT id_usuario FROM usuario WHERE email_usuario = $1`, params: [email_usuario], client });
            if (resultRawQuery.rows.length === 0) {
                logger.debug(`No user found with the provided email: ${email_usuario}`);
                return null; // No user found with the provided email
            }
            logger.debug(`User found with the provided email: ${JSON.stringify(resultRawQuery.rows[0])}`);
            const {id_usuario} = resultRawQuery.rows[0];
            logger.debug(`User found: ${id_usuario}`);
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
        const client = await db.beginTransaction();
        try {
            logger.debug(`Inserting password recovery token for user ID: ${id_usuario}`);
            await db.executeRawQuery({ query: `DELETE FROM recuperacion_contrasena_token WHERE id_usuario = $1`, params: [id_usuario], client });

            const key = "insertPasswordRecoveryToken";
            logger.debug(`Token that is going to be inserted in the DB: ${password_recovery_token}`);
            const params = [id_usuario, password_recovery_token];
            const result = await db.executeQuery({ queryKey: key, params, client });
            if (result.rowCount === 0) {
                throw new DatabaseError("Internal Server Error: Password recovery token insertion failed", 500, "No rows affected during token insertion");
            }
            await db.commitTransaction(client);
            logger.debug(`Password recovery token inserted successfully for user ID: ${id_usuario}`);
        } catch (error) {
            await db.rollbackTransaction(client);
            //console.error("[UserModel] Error inserting password recovery token:", error);
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async getUserProfile({ id_usuario }: { id_usuario: number }): Promise<UserPermissions> {
        try {
            logger.debug(`Fetching user profile for user ID: ${id_usuario}`);
            const key = "get_user_profile";
            const params = [id_usuario];
            const result = await db.executeQuery<UserPermissions>({ queryKey: key, params });
            if (result.rows.length === 0) {
                logger.debug(`No user profile found for user ID: ${id_usuario}`);
                throw new DatabaseError('El usuario no tiene un perfil asignado', 404, 'No user profile found');
            }
            logger.debug(`User profile fetched successfully for user ID: ${id_usuario}`);
            return result.rows[0];
        } catch (error) {
            
            if (error instanceof BaseError) {
                throw error;
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }
}