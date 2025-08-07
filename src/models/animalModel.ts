
import { db } from "../instances/db.js";
import { getLogger } from "../utils/logger.js";
import { Animal } from "../interfaces/animal.inferface.js";
import { DatabaseError } from "../errors/DatabaseError.js";

const logger = getLogger("ANI");


export class AnimaModel{
    static async insertAnimal(animal: Animal): Promise<Animal | null>{
        try {
            logger.info('Starting animal insertion procedure...')
            const {
                ruta_imagen_an,
                nom_animal, 
                especie_animal, 
                edad_animal, 
                genero_animal, 
                peso_animal 
                } = animal
            const key = 'insertAnimal';
            const params: any[] = [nom_animal, especie_animal, edad_animal, genero_animal, peso_animal, ruta_imagen_an];
            const result = await db.executeQuery<Animal>({
                queryKey: key,
                params
            })
            if(!result.rows[0]){
                return null
            }
            logger.info('Animal insertion completed')
            return result.rows[0];
        } catch (error) {
            console.log(error);
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return null
        }
    }

    static async getAllAnimals(): Promise<Animal[] | null>{
        try {
            logger.info('Starting retrieval of all animals...')
            const key = 'getAllAnimals';
            const result = await db.executeQuery<Animal>({queryKey: key, params: []})
            if(!result.rows || result.rows.length === 0){
                logger.info('No animals found')
                throw new DatabaseError('No animals found', 404, 'No animals found in the database');
            }
            logger.info(`Retrieved ${result.rows.length} animals`)
            return result.rows;
        } catch (error) {
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return null
        }
    }

    static async getAnimalById({id_animal}: {id_animal: number}): Promise<Animal | null>{
        try {
            logger.info(`Starting retrieval of animal with ID ${id_animal}...`)
            const key = 'getAnimalById';
            const params = [id_animal];
            const result = await db.executeQuery<Animal>({queryKey: key, params})
            if(!result.rows || result.rows.length === 0){
                logger.error(`No animal found with ID ${id_animal}`)
                return null
            }
            logger.info(`Retrieved animal with ID ${id_animal}`)
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

    // Trae los animales apadrinados por un usuario

    static async getAnimalsByUserId({id_usuario}: {id_usuario: number}): Promise<Animal[] | null>{
        try {
            logger.info(`Starting retrieval of animals for user ID ${id_usuario}...`)
            const key = 'getAnimalsByUserId';
            const params = [id_usuario];
            const result = await db.executeQuery<Animal>({queryKey: key, params})
            if(!result.rows || result.rows.length === 0){
                return null;
            }
            return result.rows;
        } catch (error) {
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return null
        }
    }

    static async updateAnimal(animal: Animal): Promise<Animal | null>{
        try {
            logger.info(`Starting update of animal with ID ${animal.id_animal}...`)
            const {ruta_imagen_an, nom_animal, especie_animal, edad_animal, genero_animal, peso_animal} = animal;
            const key = 'updateAnimal';
            const params = [
                ruta_imagen_an, 
                nom_animal, 
                especie_animal, 
                edad_animal, 
                genero_animal, 
                peso_animal, 
                animal.id_animal
            ];
            const result = await db.executeQuery<Animal>({queryKey: key, params})
            if(!result.rows || result.rows.length === 0){
                return null;
            }
            logger.info(`Animal with ID ${animal.id_animal} updated successfully`)
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

    static async deleteAnimal({id_animal}: {id_animal: number}): Promise<boolean>{
        try {
            logger.info(`Starting deletion of animal with ID ${id_animal}...`)
            const key = 'deleteAnimal';
            const params = [id_animal];
            const result = await db.executeQuery<Animal>({queryKey: key, params})
            if(result.rowCount === 0){
                logger.error(`No animal found with ID ${id_animal} to delete`)
                throw new DatabaseError(`Ocurrio un error eliminando a ${result.rows[0].nom_animal}`, 401, 'No animal found to delete');
            }
            logger.info(`Animal with ID ${id_animal} deleted successfully`)
            return true;
        } catch (error) {
            if(error instanceof DatabaseError){
                throw error
            }else if(error instanceof Error){
                throw new DatabaseError('Internal server error', 500, error.message || 'Unknown error')
            }
            return false;
        }
    }
}