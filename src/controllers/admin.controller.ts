import { Request, Response, NextFunction } from "express";
import { getLogger } from "../utils/logger.js";

const logger = getLogger("ADMIN_CONTROLLER");

export class AdminController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('getUsers called');
            const result = {
                mock: true,
                message: 'Users retrieved successfully',
                users: [
                    { id_usuario: 1, nom_usuario: "John Doe", email_usuario: "john@example.com" },
                    { id_usuario: 2, nom_usuario: "Jane Smith", email_usuario: "jane@example.com" }
                ]
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async assignProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_usuario, id_perfil } = req.body;
            logger.info(`Assigning profile ${id_perfil} to user ${id_usuario}`);
            // const result = await UserService.assignProfile(id_usuario, id_perfil);
            const result = {
                mock: true,
                message: 'Profile assigned successfully',
                user: { id_usuario, id_perfil }
            };
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async givePermissionsToProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_perfil, permissions } = req.body;
            logger.info(`Giving permissions to profile ${id_perfil}`);
            // const result = await ProfileService.givePermissions(id_perfil, permissions);
            const result = {
                mock: true,
                message: 'Permissions assigned successfully',
                profile: { id_perfil, permissions }
            };
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}