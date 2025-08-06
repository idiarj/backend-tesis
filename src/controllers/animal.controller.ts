import { AnimalService } from "../services/animalService.js";
import { Request, Response, NextFunction } from "express";
// TODO: Colocar validaciones con ZOD
export class AnimalController {
    static async AnimalPOST(req: Request, res: Response, next: NextFunction) {
        try {
            const animal = req.body;
            const response = await AnimalService.addAnimal(animal);
            res.status(201).json(response);
        } catch (error) {
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




