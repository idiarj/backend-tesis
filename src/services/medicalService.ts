import { MedicalModel } from "../models/medicalModel.js";
import { AnimaModel } from "../models/animalModel.js";
import { getLogger } from "../utils/logger.js";
import { Caso } from "../interfaces/medical.interface.js";
import { responseSuccess } from "../interfaces/status.interface.js";

const logger = getLogger("MedicalService");

export class MedicalService {
    static async createMedicalRecord(data: Caso): Promise<responseSuccess> {
        logger.info(`Creating medical record with data: ${JSON.stringify(data)}`);
        const result = await MedicalModel.createMedicalRecord(data);
        // const result = null;
        return {
            success: true,
            message: "Medical record created successfully",
            data: result
        }
    }

    static async getAllMedicalData(): Promise<responseSuccess> {
        logger.info("Fetching all medical data");
        const records = await MedicalModel.getAllMedicalRecords();
        logger.info(`Fetched ${records.length} medical records`);
        const kennels = await MedicalModel.getKennels();
        logger.info(`Fetched ${kennels.length} kennels`);
        const veterinarians = await MedicalModel.getVeterinarians();
        logger.info(`Fetched ${kennels.length} kennels and ${veterinarians.length} veterinarians`);
        const animals = await AnimaModel.getAnimals();
        logger.info(`Fetched ${animals?.length} animals`);
        if (records.length === 0) {
            return {
                success: false,
                message: "No medical records found",
                data: null
            }
        }

        return {
            success: true,
            message: "Medical data fetched successfully",
            data: {
                records,
                kennels,
                veterinarians,
                animals
            }

        }
    }


    static async getMedicalRecordById(id: number): Promise<responseSuccess> {
        logger.info(`Fetching medical record with ID: ${id}`);
        const record = await MedicalModel.getMedicalRecordById(id);
        if (!record) {
            return {
                success: false,
                message: "Medical record not found",
                data: null
            }
        }
        return {
            success: true,
            message: "Medical record fetched successfully",
            data: record
        }
    }

    static async updateMedicalRecord({id, newEstado, newInsumos, newTratamiento}: {id: number, newEstado: string, newInsumos: string, newTratamiento: string}): Promise<responseSuccess> {
        logger.info(`Updating medical record with ID: ${id} with data: ${JSON.stringify({ newEstado, newInsumos, newTratamiento })}`);
        const updatedRecord = await MedicalModel.updateMedicalRecord({id, newEstado, newInsumos, newTratamiento});
        if (!updatedRecord) {
            return {
                success: false,
                message: "Medical record not found",
                data: updatedRecord
            }
        }
        return {
            success: true,
            message: "Medical record updated successfully",
            data: updatedRecord
        }
    }
}