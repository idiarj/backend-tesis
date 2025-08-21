
import { AnimalRequest } from "../interfaces/animal.inferface.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { getLogger } from "../utils/logger.js";
import { db } from "../instances/db.js";

const logger = getLogger("REQUEST_MODEL");

export class RequestModel{
    static async insertAnimalRequest({id_usuario, id_animal, id_tipo_acogida}: {id_usuario: number, id_animal: number, id_tipo_acogida: number}): Promise<AnimalRequest | null>{
        try {
            logger.info(`Starting insertion of animal request for user ID ${id_usuario} and animal ID ${id_animal}...`)
            const key = 'insert_animal_request';
            const params = [id_usuario, id_animal, id_tipo_acogida, 1];
            const result = await db.executeQuery<AnimalRequest>({queryKey: key, params});
            if(!result.rows || result.rows.length === 0){
                return null;
            }
            logger.info(`Animal request done by user ID ${id_usuario} for animal ID ${id_animal} inserted successfully`)
            return result.rows[0];
        } catch (error) {
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return null
        }
    }

    static async acceptAnimalRequest({id_acogida}: {id_acogida: number}): Promise<AnimalRequest | null>{
        try {
            const result = await db.executeQuery<AnimalRequest>({
                queryKey: 'accept_animal_request',
                params: [id_acogida]
            });
            if(!result.rows || result.rows.length === 0){
                return null;
            }
            logger.info(`Animal request with ID ${id_acogida} accepted successfully`)
            return result.rows[0];
        } catch (error) {
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return null
        }
    }

    static async rejectAnimalRequest({id_acogida}: {id_acogida: number}): Promise<AnimalRequest | null>{
        try {
            const result = await db.executeQuery<AnimalRequest>({
                queryKey: 'reject_animal_request',
                params: [id_acogida]
            });
            if(!result.rows || result.rows.length === 0){
                return null;
            }
            logger.info(`Animal request with ID ${id_acogida} rejected successfully`)
            return result.rows[0];
        } catch (error) {
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return null
        }
    }

    static async getRequests(): Promise<AnimalRequest[]> {
        try {
            const result = await db.executeQuery<AnimalRequest>({
                queryKey: 'get_all_requests',
                params: []
            });
            if (!result.rows || result.rows.length === 0) {
                return [];
            }
            logger.info(`Retrieved ${result.rows.length} animal requests successfully`);
            return result.rows;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            } else if (error instanceof Error) {
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error');
            }
            return [];
        }
    }

    static async deleteRequest({id_acogida}: {id_acogida: number}): Promise<boolean> {
        try {
            const result = await db.executeQuery({
                queryKey: 'delete_animal_request',
                params: [id_acogida]
            });
            if (result.rowCount === 0) {
                throw new DatabaseError('Request not found', 404, 'No request found with the given ID');
            }
            logger.info(`Request with ID ${id_acogida} deleted successfully`);
            return true;
        } catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            } else if (error instanceof Error) {
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error');
            }
            return false;
        }
    }
}