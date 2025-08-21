import { Router } from "express";
import { RequestController } from "../controllers/request.controller.js";

export const requestRouter = Router();

requestRouter.get('/', RequestController.getRequests);
requestRouter.post('/', RequestController.createRequest);
requestRouter.post('/accept/:requestId', RequestController.acceptRequest);
requestRouter.post('/reject/:requestId', RequestController.rejectRequest);
requestRouter.delete('/:requestId', RequestController.cancelRequest);
