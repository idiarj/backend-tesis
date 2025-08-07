import cloudinary from "../utils/cloudinary.js";
import { UploadApiResponse } from 'cloudinary';
import { ExternalError } from "../errors/ExternalError.js";


class ImageService {
  static async uploadImage(filePath: string): Promise<UploadApiResponse | undefined> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'gatoFeliz/gatos',
      });
      return result;
    } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
        if (err instanceof Error) {
          throw new ExternalError('Ocurrio un error al subir la imagen al servicio externo', 502, `Error al subir la imagen a cloudinary: ${err.message}` );
        }
    }
  }

  static async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export default ImageService;