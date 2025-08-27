import { getLogger } from "../utils/logger.js";
import { PermissionModel } from "../models/permissionModel.js";
import { UserModel } from "../models/userModel.js";
import { Options } from '../interfaces/authorization.interface.js'


const logger = getLogger("PermissionService");

export class PermissionService {
    static async getProfilesPermission() {
        logger.info(`Fetching permissions from database for profiles...`);

        return {
            success: true,
            message: `Permisos de los perfiles obtenidos correctamente`,
            data: {

            }
        };
    }

    static async getUsers() {
        logger.info(`Fetching users from database...`);
        const users = await UserModel.getUsers();
        logger.debug(`Users fetched: ${JSON.stringify(users)}`);
        return {
            success: true,
            message: `Usuarios obtenidos correctamente`,
            data: users
        };
    }

    static async getProfiles(){
        logger.info(`Fetching profiles from database...`);
        const profiles = await PermissionModel.getProfiles();
        const profilesWithPermissions = await Promise.all(
            profiles.map(async (profile) => {
                logger.debug(`Processing profile: ${JSON.stringify(profile)}`);
                const permissionsArr = await PermissionModel.getProfilePermissions({ id_perfil: profile.id_perfil });
                const permissions: Record<string, boolean> = {};
                for (const option of Object.values(Options)) {
                    permissions[option] = permissionsArr.some(
                        (perm: any) => perm.opcion === option
                    );
                }
                return {
                    ...profile,
                    permissions
                };
            })
        );
        logger.debug(`Profiles with permissions fetched and processed: ${JSON.stringify(profilesWithPermissions)}`);
        return {
            success: true,
            message: `Perfiles obtenidos correctamente`,
            data: profilesWithPermissions
        };
    }

    static async assignProfileToUser({id_usuario, id_perfil}: {id_usuario: number, id_perfil: number}) {
        logger.info(`Starting profile assignment to user: id_usuario=${id_usuario}, id_perfil=${id_perfil}`);
        const result = await UserModel.assignProfileToUser({ id_usuario, id_perfil });
        logger.info(`Profile assigned to user successfully: ${JSON.stringify(result)}`);
        return {
            success: true,
            message: `Perfil asignado correctamente al usuario ${result[0].nom_usuario}`,
        };
    }

    static async manageProfilePermissions({ id_perfil, permissions }: { id_perfil: number, permissions: Record<string, boolean> }) {
        logger.info(`Starting to manage permissions for profile: id_perfil=${id_perfil}, permissions=${JSON.stringify(permissions)}`);
        let result = {};
        for (let key in permissions) {
            logger.info(`Processing permission: ${key}, granted: ${permissions[key]}`);
            if(permissions[key]){
                await PermissionModel.givePermissionsToProfile({ id_perfil, permission: key });
            }else if(!permissions[key]){
                await PermissionModel.removePermissionFromProfile({ id_perfil, permission: key });
            }
        }
        logger.info(`Permissions managed for profile successfully.`);
        return {
            success: true,
            message: `Permisos gestionados correctamente para el perfil ${id_perfil}`,
        };
    }
}