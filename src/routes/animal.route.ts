import { Router } from "express";
import { AnimalController } from "../controllers/animal.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizationMidd } from "../middlewares/role.middleware.js";
import { Perfil } from "../interfaces/authorization.interface.js";

export const animalRouter = Router()

animalRouter.post('/', authMiddleware, upload.single('catPhoto'), AnimalController.AnimalPOST);
animalRouter.get('/',  AnimalController.AllAnimalsGET);
animalRouter.get('/:id_animal', AnimalController.AnimalDetailGET);
animalRouter.get('/sponsorships/:id_usuario', authMiddleware, AnimalController.MySponsorhipsGET);
animalRouter.put('/', authMiddleware, AnimalController.AnimalPUT);
animalRouter.delete('/:id_animal', authMiddleware, AnimalController.AnimalDELETE);