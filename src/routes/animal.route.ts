import { Router } from "express";
import { AnimalController } from "../controllers/animal.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authenticationMidd } from "../middlewares/auth.middleware.js";
import { authorizationMidd } from "../middlewares/role.middleware.js";
import { Perfil } from "../interfaces/authorization.interface.js";

export const animalRouter = Router()

animalRouter.post('/', authenticationMidd,  authorizationMidd(Perfil.VET_ADMIN, Perfil.ADMIN), upload.single('catPhoto'), AnimalController.AnimalPOST);
animalRouter.get('/',  AnimalController.AllAnimalsGET);
animalRouter.get('/sponsorships', authenticationMidd, AnimalController.MySponsorhipsGET);
animalRouter.get('/last', AnimalController.getLastCat)
animalRouter.delete('/:id_animal', authenticationMidd, authorizationMidd(Perfil.VET_ADMIN, Perfil.ADMIN), AnimalController.AnimalDELETE);
// animalRouter.get('/:id_animal', AnimalController.AnimalDetailGET);
// animalRouter.put('/', authenticationMidd, AnimalController.AnimalPUT);
