import { AnimalService } from "../services/animalService.js";
import { Request, Response, NextFunction } from "express";
import { AnimalSchema } from "../interfaces/animal.inferface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { validateSchema } from "../utils/validation.js";
import { getLogger } from '../utils/logger.js';


const logger = getLogger('AnimalController');
export class AnimalController {
    static async AnimalPOST(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('AnimalPOST called');
            logger.debug(`Request body before processing: ${JSON.stringify(req.body)}`);
            req.body = {
                ...req.body,
                peso_animal: Number(req.body.peso_animal)
            }
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);
            //logger.debug(`File uploaded: ${req.file ? req.file.path : 'No file uploaded'}`);
            const validation = validateSchema({
                schema: AnimalSchema,
                data: req.body
            })
            if (!validation.success) {
                throw new ValidationError(validation.error, 400, `Error de validacion: ${validation.error}`);
            }
            const filePath = req.file?.path;
            let animal = {
                ...req.body,
                ruta_imagen_an: filePath
            }
            const response = await AnimalService.addAnimal(animal);
            res.status(201).json(response);
        } catch (error) {
            if(error instanceof ValidationError) {
                logger.error(`Validation error in AnimalPOST: ${error.message}`);
            }
            next(error);
        }
    }

    static AllAnimalsGET(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            next(error);
        }
    }

    static async AnimalDetailGET(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            next(error);
        }
    }

    static async MySponsorhipsGET(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }

    static async AnimalPUT(req: Request, res: Response, next: NextFunction){
        try {


        } catch (error) {
            next(error);
        }
    }

    static async AnimalDELETE(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }

}




