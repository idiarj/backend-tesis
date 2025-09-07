import { db } from "../instances/db.js";
import { getLogger } from "../utils/logger.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { Caso } from "../interfaces/medical.interface.js";
const logger = getLogger("MedicalModel");
export class MedicalModel {


    static async getAllMedicalRecords(): Promise<any> {
        try {
            const queryKey = "select_all_medical_records";
            const params: any[] = [];
            const result = await db.executeQuery({
                queryKey,
                params
            });
            return result.rows;
        } catch (error) {
            logger.error("Error fetching medical records", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            return [];
        }
    }

    static async createMedicalRecord(data: Caso): Promise<Caso | undefined> {
        try {
            const { des_caso, id_usuario, id_animal, id_caso_est, sexo_animal_caso, especie_animal_caso, edad_animal_caso, senas_caso, motivo_caso, historia_caso, dieta_caso, vacunacion_caso, desp_caso, prod_caso, fechas_caso, estado_repr, proc_caso, peso_animal_caso, temperatura_animal_caso, fcar_animal_caso, fres_animal_caso, tllc_animal_caso, mucosas_animal_caso, turg_piel_animal_caso, pulso_animal_caso, otras_animal_caso, anamnesis_caso, enfer_ante_animal_caso, fecha_agregado_caso, hora_agregado_caso, id_kennel, nom_animal_caso, nom_dueno_caso, tlf_dueno_caso, direccion_dueno, ciudad_dueno } = data;
            const queryKey = "insert_medical_record";
            const params: any[] = [
                des_caso,
                id_usuario,
                id_animal,
                id_caso_est,
                sexo_animal_caso,
                especie_animal_caso,
                edad_animal_caso,
                senas_caso,
                motivo_caso,
                historia_caso,
                dieta_caso,
                vacunacion_caso,
                desp_caso,
                prod_caso,
                fechas_caso,
                estado_repr,
                proc_caso,
                peso_animal_caso,
                temperatura_animal_caso,
                fcar_animal_caso,
                fres_animal_caso,
                tllc_animal_caso,
                mucosas_animal_caso,
                turg_piel_animal_caso,
                pulso_animal_caso,
                otras_animal_caso,
                anamnesis_caso,
                enfer_ante_animal_caso,
                fecha_agregado_caso,
                hora_agregado_caso,
                id_kennel,
                nom_animal_caso,
                nom_dueno_caso,
                tlf_dueno_caso,
                direccion_dueno,
                ciudad_dueno
            ];

            logger.debug(`Cantidad de parametros: ${params.length}`);
            logger.info("Creating medical record");
            const result = await db.executeQuery<Caso>({
                queryKey,
                params
            });
            // Assuming result.rows is an array of Caso objects
            return result.rows?.[0];
        } catch (error) {
            logger.error("Error creating medical record", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
        }
    }

    static async getVeterinarians(): Promise<any> {
        try {
            const query = 'SELECT id_usuario, nom_usuario AS veterinario FROM usuario WHERE id_perfil = $1 OR id_perfil = $2';
            const params = [3, 4]; // Example profile IDs for veterinarians
            const result = await db.executeRawQuery({
                query,
                params
            });
            return result.rows;
        } catch (error) {
            logger.error("Error fetching veterinarians", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            return [];
        }
    }

    static async getMedicalRecordById(id: number): Promise<any> {
        try {
            const queryKey = "select_medical_record";
            const params = [id];
            const result = await db.executeQuery({
                queryKey,
                params
            });
            return result;
        } catch (error) {
            logger.error("Error fetching medical record", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
        }
    }


    static async updateMedicalRecord(id: number, updates: {}): Promise<any> {
        try {
            const queryKey = "update_medical_record";
            const params = [id, updates];
            const result = await db.executeQuery({
                queryKey,
                params
            });
            return result;
        } catch (error) {
            logger.error("Error updating medical record", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
        }
    }

    static async deleteMedicalRecord(id: number): Promise<void> {
        try {
            const queryKey = "delete_medical_record";
            const params = [id];
            await db.executeQuery({
                queryKey,
                params
            });
        } catch (error) {
            logger.error("Error deleting medical record", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
        }
    }

    static async getKennels(): Promise<any> {
        try {
            const queryKey = "select_kennels";
            const params: unknown[] = [];
            const result = await db.executeQuery({
                queryKey,
                params
            });
            return result.rows;
        } catch (error) {
            logger.error("Error fetching kennels", error);
            if (error instanceof DatabaseError) {
                throw error;
            }
            return []   ;
        }
    }
    
}