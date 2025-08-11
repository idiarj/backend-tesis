import cloudinary from "../utils/cloudinary.js";
import { UploadApiResponse } from 'cloudinary';
import { ExternalError } from "../errors/ExternalError.js";
import { getLogger } from "../utils/logger.js";


const logger = getLogger('ImageService');

class ImageService {
  static async uploadImage({filePath, catId}: {filePath: string, catId: number}): Promise<UploadApiResponse | undefined> {
    try {
      logger.debug(`Uploading image at path: ${filePath}`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'gatoFeliz/gatos',
        tags: ['gatoFeliz'],
        public_id: catId ? `cat_${catId}` : undefined,
      });
      logger.debug(`Image uploaded successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
        if (err instanceof Error) {
          throw new ExternalError('Ocurrio un error al subir la imagen al servicio externo', 502, `Error al subir la imagen a cloudinary: ${err.message}` );
        }
    }
  }



  static async deleteImage(publicId: string) {
    logger.debug(`Deleting image with public ID: ${publicId}`);
    if(!publicId){
      throw new ExternalError('No se pudo encontrar la imagen a eliminar', 404, `No se encontro la imagen con el id: ${publicId}`);
    }
    const result = await cloudinary.uploader.destroy(`gatoFeliz/gatos/${publicId}`);
    logger.debug(`Image deleted successfully: ${JSON.stringify(result)}`);
  }
}

export default ImageService;