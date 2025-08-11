import { AnimalService } from "../services/animalService.js";
import { Request, Response, NextFunction } from "express";
import { AnimalSchema } from "../interfaces/animal.inferface.js";
import { ValidationError } from "../errors/ValidationError.js";
import { validateSchema } from "../utils/validation.js";
import { getLogger } from '../utils/logger.js';
import { InternalError } from "../errors/InternalError.js";


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

    static async AllAnimalsGET(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('AllAnimalsGET called');
            const response = await AnimalService.getAllAnimals();
            logger.debug(`Response from AnimalService.getAllAnimals: ${JSON.stringify(response)}`);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async AnimalDetailGET(req: Request, res: Response, next: NextFunction) {
        try {
            const {id_animal} = req.params;
            const response = await AnimalService.getAnimal({id_animal: Number(id_animal)});
            res.status(200).json(response);
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
            logger.info(`AnimalDELETE called`);

            const { id_animal } = req.params;
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);
            if(!id_animal){
                throw new InternalError('Internal server, error please try again later', 500, 'No se proporcionó un ID de animal');
            }
            const response = await AnimalService.deleteAnimal({ id_animal: Number(id_animal) });
            logger.debug(`Response from AnimalService.deleteAnimal: ${response.success}`);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

}




