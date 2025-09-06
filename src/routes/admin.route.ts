import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authorizationMidd } from "../middlewares/role.middleware.js"; //autorizacion
import { authenticationMidd } from "../middlewares/auth.middleware.js"; //Autenticacion
import { Perfil } from "../interfaces/authorization.interface.js";


export const adminRouter = Router();

adminRouter.get('/profiles', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.VET), AdminController.getProfiles);
adminRouter.get('/users', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.VET), AdminController.getUsers);
adminRouter.post('/assign-profile', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.VET), AdminController.assignProfile);
adminRouter.post('/manage-permissions', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.VET), AdminController.managePermissionsForProfile);

// adminRouter.get('/profiles',  AdminController.getProfiles);
// adminRouter.get('/users', AdminController.getUsers);
// adminRouter.post('/assign-profile', AdminController.assignProfile);
// adminRouter.post('/manage-permissions', AdminController.managePermissionsForProfile);

