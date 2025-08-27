import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authorizationMidd } from "../middlewares/role.middleware.js"; //autorizacion
import { authenticationMidd } from "../middlewares/auth.middleware.js"; //Autenticacion
import { Perfil } from "../interfaces/authorization.interface.js";


export const adminRouter = Router();

adminRouter.get('/profiles', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), AdminController.getProfiles);
adminRouter.get('/users', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), AdminController.getUsers);
adminRouter.post('/assign-profile', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), AdminController.assignProfile);
adminRouter.post('/give-permissions', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), AdminController.givePermissionsToProfile);