import { Router } from "express";
import { RequestController } from "../controllers/request.controller.js";

export const requestRouter = Router();

requestRouter.get('/', RequestController.getRequests);
requestRouter.get('/pending', RequestController.getPendingRequests);
requestRouter.post('/', RequestController.createRequest);
requestRouter.patch('/accept/:requestId', RequestController.acceptRequest);
requestRouter.patch('/reject/:requestId', RequestController.rejectRequest);
requestRouter.delete('/:requestId', RequestController.cancelRequest);
