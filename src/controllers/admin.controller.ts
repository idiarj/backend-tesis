import { Request, Response, NextFunction } from "express";
import { getLogger } from "../utils/logger.js";
import { PermissionService } from "../services/permissionService.js";

const logger = getLogger("ADMIN_CONTROLLER");

export class AdminController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('getUsers called');
            const result = await PermissionService.getUsers();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async assignProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_usuario, id_perfil } = req.body;
            logger.info(`Assigning profile ${id_perfil} to user ${id_usuario}`);
            const result = await PermissionService.assignProfileToUser({ id_usuario, id_perfil });
            // const result = {
            //     mock: true,
            //     message: 'Profile assigned successfully',
            //     user: { id_usuario, id_perfil }
            // };
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async managePermissionsForProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_perfil, permissions } = req.body;
            logger.info(`Managing permissions for profile ${id_perfil}`);
            logger.debug(`Permissions to manage: ${JSON.stringify(permissions)}`);
            const result = await PermissionService.manageProfilePermissions({ id_perfil, permissions });
            // const result = {
            //     mock: true,
            //     message: 'Permissions assigned successfully',
            //     profile: { id_perfil, permissions_given: permissions }
            // };
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getProfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PermissionService.getProfiles();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}