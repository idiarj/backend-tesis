import { Router } from "express";
import { AnimalController } from "../controllers/animal.controller.js";
import { upload } from "../middlewares/upload.middleware.js";



export const animalRouter = Router()

animalRouter.post('/', upload.single('catPhoto'), AnimalController.AnimalPOST);
animalRouter.get('/', AnimalController.AllAnimalsGET);
animalRouter.get('/:id_animal', AnimalController.AnimalDetailGET);
animalRouter.get('/sponsorships/:id_usuario', AnimalController.MySponsorhipsGET);
animalRouter.put('/', AnimalController.AnimalPUT);
animalRouter.delete('/:id_animal', AnimalController.AnimalDELETE);