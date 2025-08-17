import { MedicalModel } from "../models/medicalModel.js";



export class MedicalService {
    static async createMedicalRecord(data: { victoria: string, puta: string }): Promise<any> {
        return MedicalModel.createMedicalRecord(data);
    }
}