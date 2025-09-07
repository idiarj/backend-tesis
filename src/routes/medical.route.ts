import { Router } from "express";
import { MedicalController } from "../controllers/medical.controller.js";
import { authorizationMidd } from "../middlewares/role.middleware.js";
import { authenticationMidd } from "../middlewares/auth.middleware.js";
import { Perfil } from "../interfaces/authorization.interface.js";

export const medicalRouter = Router();

medicalRouter.post('/', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.SUPER_ADMIN), MedicalController.createMedicalRecord);
medicalRouter.get('/', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.SUPER_ADMIN), MedicalController.getAllMedicalData);
medicalRouter.get('/:id', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.SUPER_ADMIN), MedicalController.getMedicalRecordById);
medicalRouter.put('/:id', authenticationMidd, authorizationMidd(Perfil.ADMIN, Perfil.VET_ADMIN, Perfil.SUPER_ADMIN), MedicalController.updateMedicalRecord);

// medicalRouter.post('/', authenticationMidd, MedicalController.createMedicalRecord);
// medicalRouter.get('/', authenticationMidd, MedicalController.getAllMedicalData);
// medicalRouter.get('/:id', authenticationMidd, MedicalController.getMedicalRecordById);
// medicalRouter.put('/:id', authenticationMidd, MedicalController.updateMedicalRecord);



