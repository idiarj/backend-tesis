import { getLogger } from "../utils/logger.js";
import { PermissionModel } from "../models/permissionModel.js";
import { UserModel } from "../models/userModel.js";


const logger = getLogger("PermissionService");

export class PermissionService {
    static async getPermissionsFromDB({id_usuario}: {id_usuario: number}) {
        logger.info(`Fetching permissions from database for user with id ${id_usuario}...`);
        const {id_perfil, perfil} = await UserModel.getUserProfile({id_usuario})
        logger.debug(`User profile fetched: ${JSON.stringify({id_perfil, perfil})}`);
        return {
            success: true,
            message: `Permisos del usuario con id ${id_usuario} obtenidos correctamente`,
            data: {
                id_perfil,
                perfil
            }
        };
    }
}