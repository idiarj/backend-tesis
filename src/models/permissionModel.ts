import { BaseError } from "../errors/BaseError.js";
import { db } from "../instances/db.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { getLogger } from "../utils/logger.js";
import { ValidationError } from "../errors/ValidationError.js";

const logger = getLogger("PermissionModel");

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
            logger.debug(`Permissions for profile ${id_perfil}: ${JSON.stringify(result.rows)}`);
            return result.rows;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al obtener los permisos del perfil de la base de datos', 500, 'Unknown Error');
        }
    }

    static async givePermissionsToProfile({id_perfil, permission}: {id_perfil: number, permission: string}) {
        const id_opcion = await this.getPermissionId({ permission });
        const hasPermission = await this.checkIfProfileHasPermission({ id_perfil, id_opcion });
        if (hasPermission) {
            logger.info(`El perfil ${id_perfil} ya tiene el permiso ${permission}, no se asigna nuevamente.`);
            return;
        }
        const client = await db.beginTransaction();
        try {
            logger.debug(`hasPermission es ${hasPermission}, por lo tanto se asignara al perfil con id ${id_perfil} la opcion con id ${id_opcion}`);
            await db.executeQuery({
                queryKey: 'give_permission_to_profile',
                params: [id_perfil, id_opcion],
                client
            })
            await db.commitTransaction(client);
        } catch (error) {
            await db.rollbackTransaction(client);
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al asignar los permisos al perfil en la base de datos', 500, 'Unknown Error');
        }
    }

    static async removePermissionFromProfile({id_perfil, permission}: {id_perfil: number, permission: string}) {
        const id_opcion = await this.getPermissionId({ permission });
        const hasPermission = await this.checkIfProfileHasPermission({ id_perfil, id_opcion });
        if(!hasPermission) {
            logger.info(`El perfil ${id_perfil} no tiene el permiso ${permission}, no se puede eliminar.`);
            return;
        }
        const client = await db.beginTransaction();
        try {
            await db.executeQuery({
                queryKey: 'remove_permission_from_profile',
                params: [id_perfil, id_opcion],
                client
            })
            await db.commitTransaction(client);
        } catch (error) {
            await db.rollbackTransaction(client);
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al asignar los permisos al perfil en la base de datos', 500, 'Unknown Error');
        }
    }


    static async checkIfProfileHasPermission({id_perfil, id_opcion}: {id_perfil: number, id_opcion: number}) {
        try {
            const result = await db.executeRawQuery({
                query: 'SELECT * FROM perfil_opcion WHERE id_perfil = $1 AND id_opcion = $2',
                params: [id_perfil, id_opcion]
            })
            return result.rows.length > 0;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al verificar si el perfil ya tiene el permiso en la base de datos', 500, 'Unknown Error');
        }
    }

    static async getPermissionId({permission}: {permission: string}) {
        try {
            const result = await db.executeRawQuery({
                query: 'SELECT id_opcion FROM opcion WHERE des_opcion = $1',
                params: [permission]
            })
            return result.rows[0]?.id_opcion;
        } catch (error) {
            if(error instanceof BaseError) throw error;
            throw new DatabaseError('Error al obtener el id de la opcion en la base de datos', 500, 'Unknown Error');
        }
    }

}