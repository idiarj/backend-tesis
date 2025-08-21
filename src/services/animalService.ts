import { AnimaModel } from "../models/animalModel.js";
import { Animal } from "../interfaces/animal.inferface.js";
import { getLogger } from "../utils/logger.js";
import { responseSuccess } from "../interfaces/status.interface.js";
import { InternalError } from "../errors/InternalError.js";
import fs from 'fs';
import ImageService from "./imageService.js";

const logger = getLogger('AnS')
export class AnimalService {
    static async addAnimal(animal: Animal): Promise<responseSuccess> {
        logger.debug(`Starting addition of animal ${animal.nom_animal} procedure.`);

        const data = await AnimaModel.insertAnimal(animal);
        if(!data){
            throw new InternalError('Error interno al agregar el animal', 500, `Error al agregar el animal, el resultado de la insercion es ${data}`);
        }
        if (typeof data.id_animal !== 'number') {
            throw new InternalError('Error interno al agregar el animal', 500, 'El id_animal es indefinido');
        }
        const imageServiceResult = await ImageService.uploadImage({
            filePath: animal.ruta_imagen_an || '',
            catId: data.id_animal
        });
        if (!imageServiceResult) {
            logger.error('Error uploading image to cloudinary');
            throw new InternalError('Ocurrio un error al subir la imagen al servicio externo', 502, 'Error al subir la imagen a cloudinary');
        }
        const url_imagen_animal = imageServiceResult.secure_url;
        if (!url_imagen_animal) {
            logger.error('Error: secure_url is undefined after image upload');
            throw new InternalError('Ocurrio un error al obtener la URL de la imagen subida', 502, 'secure_url es indefinido despues de subir la imagen');
        }
        const updateImageUrlResult = await AnimaModel.updateAnimalPhoto({
            photoURL: url_imagen_animal,
            catId: data.id_animal
        });
        if (!updateImageUrlResult) {
            logger.error('Error updating animal image URL');
            throw new InternalError('Ocurrio un error al actualizar la URL de la imagen del animal', 502, 'Error al actualizar la URL de la imagen del animal');
        }
        //Data es lo que viene de la bd, por ende es lo que mas me interesa enviar de nuevo al front
        // animal es lo que viene en la request y el controlador delega al servicio.

        data.ruta_imagen_an = url_imagen_animal;
        if (animal.ruta_imagen_an) {
            fs.unlink(animal.ruta_imagen_an, (err) => {
                if (err) logger.error(`Error deleting temp image: ${err.message}`);
                else logger.info(`Temp image deleted: ${animal.ruta_imagen_an}`);
            });
                }

        logger.debug(`Animal ${animal.nom_animal} added successfully with id ${data?.id_animal}`);
        return {
            success: true,
            message: `${animal.nom_animal} anadido correctamente`,
            data
        }
    }

    static async getAnimals({adoptable}: {adoptable: boolean}): Promise<responseSuccess>{
        logger.debug('Starting to get all animals');
        let data: Animal[] | null;
        if(adoptable){
            data = await AnimaModel.getAdoptableAnimals();
        } else {
            data = await AnimaModel.getAnimals();
        }
        logger.debug(`Retrieval of all animals done succesfully`);
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
        }
    }

    static async deleteAnimal({id_animal}: {id_animal: number}): Promise<responseSuccess>{
        logger.debug(`Deleting animal with id ${id_animal}`)
        const deletionSuccess = await AnimaModel.deleteAnimal({id_animal})
        if (!deletionSuccess) {
            //logger.error(`Failed to delete animal with id ${id_animal}`);
            throw new InternalError('Internal server error', 500, `No se pudo eliminar el animal con id: ${id_animal}`);
        }
        await ImageService.deleteImage(`cat_${id_animal}`);
        logger.debug(`Animal with id ${id_animal} deleted successfully`)
        return {
            success: deletionSuccess,
            message: `El animal ha sido eliminado correctamente`,
        }
    }
}