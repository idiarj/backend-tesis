import { BaseError } from "../errors/BaseError.js";
import { db } from "../instances/db.js";
import { DatabaseError } from "../errors/DatabaseError.js";
export class PermissionModel {
    static async getProfiles(): Promise<{id_perfil: number, perfil: string}[]> {
        try {
            const queryKey = 'get_profiles'
            const result = await db.executeQuery({
                queryKey,
                params: []
            })
            return result.rows;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al obtener los perfiles de la base de datos', 500, 'Unknown Error');
        }
    }

    static async getProfilePermissions({id_perfil}: {id_perfil: number}) {
        try {
            const queryKey = 'get_profile_permissions'
            const result = await db.executeQuery({
                queryKey,
                params: [id_perfil]
            })
            return result.rows;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al obtener los permisos del perfil de la base de datos', 500, 'Unknown Error');
        }
    }

}