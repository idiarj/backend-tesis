import { v2 as cloudinary } from 'cloudinary';
import { cloudinary_config } from '../configs/config.js';

cloudinary.config({
  cloud_name: cloudinary_config.CLOUDINARY_NAME,
  api_key: cloudinary_config.CLOUDINARY_KEY,
  api_secret: cloudinary_config.CLOUDINARY_SECRET
});

export default cloudinary;
