import { Router } from "express";
import { MedicalController } from "../controllers/medical.controller.js";
import { authorizationMidd } from "../middlewares/role.middleware.js";
import { authenticationMidd } from "../middlewares/auth.middleware.js";

export const medicalRouter = Router();

medicalRouter.post('/', MedicalController.createMedicalRecord);
medicalRouter.get('/', MedicalController.getAllMedicalData);
medicalRouter.get('/:id', MedicalController.getMedicalRecordById);
medicalRouter.put('/:id', MedicalController.updateMedicalRecord);

// medicalRouter.post('/', authenticationMidd, MedicalController.createMedicalRecord);
// medicalRouter.get('/', authenticationMidd, MedicalController.getAllMedicalData);
// medicalRouter.get('/:id', authenticationMidd, MedicalController.getMedicalRecordById);
// medicalRouter.put('/:id', authenticationMidd, MedicalController.updateMedicalRecord);



