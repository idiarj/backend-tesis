import { Router } from "express";
import { RequestController } from "../controllers/request.controller.js";
import { authorizationMidd } from "../middlewares/role.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Perfil } from "../interfaces/authorization.interface.js";

export const requestRouter = Router();

requestRouter.get('/', authMiddleware, authorizationMidd(Perfil.ADMIN), RequestController.getRequests);
requestRouter.get('/pending', RequestController.getPendingRequests);
requestRouter.post('/', RequestController.createRequest);
requestRouter.patch('/accept/:requestId', RequestController.acceptRequest);
requestRouter.patch('/reject/:requestId', RequestController.rejectRequest);
requestRouter.delete('/:requestId', RequestController.cancelRequest);
