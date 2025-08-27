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
}