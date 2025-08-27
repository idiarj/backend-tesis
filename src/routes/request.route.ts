import { Router } from "express";
import { RequestController } from "../controllers/request.controller.js";
import { authorizationMidd } from "../middlewares/role.middleware.js";
import { authenticationMidd } from "../middlewares/auth.middleware.js";
import { Perfil } from "../interfaces/authorization.interface.js";

export const requestRouter = Router();

requestRouter.get('/', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), RequestController.getRequests);
requestRouter.get('/pending', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), RequestController.getPendingRequests);
requestRouter.post('/', authenticationMidd, RequestController.createRequest);
requestRouter.patch('/accept/:requestId', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), RequestController.acceptRequest);
requestRouter.patch('/reject/:requestId', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), RequestController.rejectRequest);
requestRouter.delete('/:requestId', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN), RequestController.cancelRequest);
