import { MedicalService } from "../services/medicalService.js";
import { Request, Response, NextFunction } from "express";
import { getLogger } from "../utils/logger.js";

const logger = getLogger("MedicalController");
export class MedicalController {
    static async createMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const data = req.body;
            logger.info(`Received request to create medical record with body: ${JSON.stringify(data)}`);
            const result = await MedicalService.createMedicalRecord(data);
            // const result = { mock: true, message: "Medical record created successfully", data };
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getAllMedicalData(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("Received request to fetch all medical data");
            const result = await MedicalService.getAllMedicalData();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getMedicalRecordById(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = parseInt(req.params.id);
            const result = await MedicalService.getMedicalRecordById(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async updateMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info(`Received request to update medical record with ID: ${req.params.id} and body: ${JSON.stringify(req.body)}`);
            const { id } = req.params;
            const { newEstado, newInsumos, newTratamiento } = req.body;
            const result = await MedicalService.updateMedicalRecord({ id: Number(id), newEstado, newInsumos, newTratamiento });
            // const result = {
            //     mock: true,
            //     message: `Medical record with ID ${id} updated successfully`,
            //     data: { id: Number(id), newEstado, newInsumos, newTratamiento }
            // }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}