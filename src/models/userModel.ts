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
            if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message);
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async validateUser({username}: { username: string }) {
        try {
            console.log("[UserModel] Fetching user by username...");
            const key = "getUsername";
            if(db.querys[key] === undefined) {
                throw new DatabaseError('Internal server error, please try again later', 500, `Query for key ${key} not found.`);
            }
            const params = [username];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            return result.rows[0]; // Return the found user
        } catch (error) {
            //console.error("[UserModel] Error fetching user by username:", error);
            if(error instanceof BaseError){
                throw error; // Re-throw known errors
            }else if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message);
            }
        }
    }

    static async validateEmail({email}: { email: string }): Promise<LoginCredentials | null> {
        try {
            console.log("[UserModel] Fetching user by email...");
            const key = "getUserByEmail";
            if(db.querys[key] === undefined) {
                throw new DatabaseError('Internal server error, please try again later', 500, `Query for key ${key} not found.`);
            }
            const params = [email];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            return result.rows[0]; // Return the found user
        } catch (error) {
            //console.error("[UserModel] Error fetching user by email:", error);
            if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message);
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async validatePassword(){
        try {
            
        } catch (error) {
            
        }
    }

    static async getUserById({id_usuario}: { id_usuario: number }): Promise<User | null> {
        try {
            console.log("[UserModel] Fetching user by ID...");
            const key = "getUserById";
            if(db.querys[key] === undefined) {
                throw new DatabaseError('Internal server error, please try again later', 500, `Query for key ${key} not found.`);
            }
            const params = [id_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                return null; // No user found
            }
            return result.rows[0]; // Return the found user
        } catch (error) {
            //console.error("[UserModel] Error fetching user by ID:", error);
            if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message);
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }

    static async updateUser({nom_usuario, pwd_usuario, email_usuario, tlf_usuario}: User): Promise<User> {
        try {
            console.log("[UserModel] Updating user...");
            const key = "updateUser";
            if(db.querys[key] === undefined) {
                throw new DatabaseError('Internal server error, please try again later', 500, `Query for key ${key} not found.`);
            }
            const params = [nom_usuario, email_usuario, pwd_usuario, tlf_usuario];
            const result = await db.executeQuery({ queryKey: key, params });
            if (result.rows.length === 0) {
                throw new Error("User update failed");
            }
            return result.rows[0]; // Return the updated user
        } catch (error) {
            //console.error("[UserModel] Error updating user:", error);
            if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message);
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
            if (error instanceof Error) {
                throw new DatabaseError('Internal server error, please try again later', 500, error.message);
            } else {
                throw new DatabaseError('Internal server error, please try again later', 500, 'Unknown error');
            }
        }
    }
}