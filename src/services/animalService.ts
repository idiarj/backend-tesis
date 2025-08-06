import { AnimaModel } from "../models/animalModel.js";
import { Animal } from "../interfaces/animal.inferface.js";
import { getLogger } from "../utils/logger.js";
import { responseSuccess } from "../interfaces/status.interface.js";

const logger = getLogger('AnS')
export class AnimalService {
    static async addAnimal(animal: Animal): Promise<responseSuccess> {
        logger.debug(`Starting addition of animal ${animal.nom_animal} procedure.`);
        const data = await AnimaModel.insertAnimal(animal);
        logger.debug(`Addition of ${animal.nom_animal} done successfully.`)
        return {
            success: true,
            message: `${animal.nom_animal} anadido correctamente`,
            data
        }
    }

    static async getAllAnimals(): Promise<responseSuccess>{
        logger.debug('Starting to get all animals');
        const data = await AnimaModel.getAllAnimals();
        logger.debug(`Retrieval of all animals done succesfully`)
        return {
            success: true,
            message: 'Los animales han sido obtenidos correctamente',
            data
        }
    }

    static async getAnimal({id_animal}: {id_animal: number}): Promise<responseSuccess>{
        logger.debug(`Getting specific animal with id ${id_animal}`)
        const data = await AnimaModel.getAnimalById({id_animal})
        logger.debug('Getting specific anima proccess done successfully');
        return {
            success: true,
            message: `Los datos del animal ha sido obtenida correctamente`,
            data
        }
    }

    static async getMySponsorhips({id_usuario}: {id_usuario: number}): Promise<responseSuccess>{
        logger.debug(`Getting animals sponsorshipped by user with id ${id_usuario}`)
        const data = await AnimaModel.getAnimalsByUserId({id_usuario})
        logger.debug(`All animals sponsrshipped by id: ${id_usuario} done successfully`)
        return {
            success: true,
            message: 'Todos los apadrinados han sido obtenidos correctamente',
            data
        }
    }

    static async updateAnimal(animal: Animal): Promise<responseSuccess>{
        logger.debug(`Updating animal with ${animal.id_animal}`)
        const data = await AnimaModel.updateAnimal(animal)
        logger.debug(`Animal with id ${animal.id_animal} updated successfully`)
        return {
            success: true,
            message: `El animal ha sido actualizado correctamente`,
            data
        }
    }

    static async deleteAnimal({id_animal}: {id_animal: number}): Promise<responseSuccess>{
        logger.debug(`Deleting animal with id ${id_animal}`)
        const deletionSuccess = await AnimaModel.deleteAnimal({id_animal})
        logger.debug(`Animal with id ${id_animal} deleted successfully`)
        return {
            success: deletionSuccess,
            message: `El animal ha sido eliminado correctamente`,
        }
    }


}