import cloudinary from "../utils/cloudinary.js";
import { UploadApiResponse } from 'cloudinary';
import { ExternalError } from "../errors/ExternalError.js";
import { getLogger } from "../utils/logger.js";

export type FolderImage = {
  name: string; // nombre legible del archivo
  url: string;  // secure_url
};

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

  static async listAllFromFolder(folder: string): Promise<FolderImage[]> {
    try {
      logger.debug(`Listing all images from folder: ${folder}`);
      const result = await cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        prefix: folder.endsWith("/") ? folder : `${folder}/`,
        max_results: 50, // suficiente para tus 7 imágenes
      });

      return result.resources.map((r: any) => {
        const name =
          r.filename ??
          (r.public_id.includes("/")
            ? r.public_id.split("/").pop()
            : r.public_id);

        return {
          name,
          url: r.secure_url,
        };
      });
    } catch (err) {
      logger.error(`Error listing images from Cloudinary ${err}`);
      throw new ExternalError('Error al listar imágenes de la carpeta', 502, `Error al listar imágenes de Cloudinary.`);
    }
  }

  static async getImages({catId}: {catId: number}): Promise<UploadApiResponse | undefined> {
    try {
      logger.debug(`Fetching images for category ID: ${catId}`);
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: `gatoFeliz/gatos/cat_${catId}`,
      });
      logger.debug(`Images fetched successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      console.error('Error fetching images from Cloudinary:', err);
      if (err instanceof Error) {
        throw new ExternalError('Ocurrio un error al obtener las imagenes del servicio externo', 502, `Error al obtener las imagenes de cloudinary: ${err.message}`);
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