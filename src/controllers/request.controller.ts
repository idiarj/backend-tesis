import { getLogger } from "../utils/logger.js";
import { Request, Response, NextFunction } from "express";
import { RequestService } from "../services/requestService.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { Token } from "../security/token.js";
import { server_config } from "../configs/config.js";
import { responseSuccess } from "../interfaces/status.interface.js";

const logger = getLogger("REQUEST_CONTROLLER");


export class RequestController{
    static async getRequests(req: Request, res: Response, next: NextFunction): Promise<responseSuccess | any>{
        try {
            logger.info('getRequests called');
            const result = await RequestService.getRequests();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getPendingRequests(req: Request, res: Response, next: NextFunction): Promise<responseSuccess | any>{
        try {
            logger.info('getPendingRequests called');
            const result = await RequestService.getPendingRequests();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async createRequest(req: Request, res: Response, next: NextFunction){
        try {
            logger.info('createRequest called');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);
            logger.debug(`Request query: ${JSON.stringify(req.query)}`);
            logger.debug(`Request cookies: ${JSON.stringify(req.cookies)}`);
            //logger.debug(`Request: ${JSON.stringify(req)}`);
            const { id_animal } = req.body;
            const { type } = req.query;
            const { access_token } = req.cookies;
            if(!access_token) throw new ForbiddenError('Debes iniciar sesion para realizar esta accion', 403, 'No access token provided');
            const decoded = Token.verifyToken({
                token: access_token,
                secret: server_config.ACCESS_TOKEN_SECRET ?? ''
            });
            logger.debug(`USER ID ${decoded.id_usuario} requested a new ${type} request for CAT ID ${id_animal}`);
            if(!type || typeof type !== "string"){
                throw new ValidationError('Error en las validaciones al solicitar una acogida.', 400, 'Debe especificarse un tipo de acogida.')
            }

            const result = await RequestService.createRequest({
                id_usuario: decoded.id_usuario,
                id_animal,
                tipo_acogida: type
            })

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async acceptRequest(req: Request, res: Response, next: NextFunction): Promise<responseSuccess | any>{
        try {
            logger.info('acceptRequest called');
            const { requestId } = req.params;
            if(!requestId) throw new ValidationError('Error en las validaciones al aceptar la solicitud.', 400, 'Debe especificarse un ID de solicitud.')
            const result = await RequestService.acceptRequest({
                id_acogida: Number(requestId)
            });
            logger.info(`Request with ID ${requestId} accepted successfully`);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<responseSuccess | any>{
        try {
            logger.info('rejectRequest called');
            const { requestId } = req.params;
            if(!requestId) throw new ValidationError('Error en las validaciones al rechazar la solicitud.', 400, 'Debe especificarse un ID de solicitud.')
            const result = await RequestService.rejectRequest({
                id_acogida: Number(requestId)
            });
            logger.info(`Request with ID ${requestId} rejected successfully`);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async cancelRequest(req: Request, res: Response, next: NextFunction): Promise<responseSuccess | any>{
        try {
            logger.info('cancelRequest called');
            const { requestId } = req.params;
            if(!requestId) throw new ValidationError('Error en las validaciones al cancelar la solicitud.', 400, 'Debe especificarse un ID de solicitud.')
            const result = await RequestService.deleteRequest({
                id_acogida: Number(requestId)
            });
            logger.info(`Request with ID ${requestId} canceled successfully`);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}