import { readJson } from "../utils/readJson.js";
import { cors_config } from "./cors_config.js";
import { getLogger } from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const logger = getLogger('CONFIG');



export const server_config = {
    PORT: process.env.PORT || 3000,
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    RECOVER_PASSWORD_TOKEN_SECRET: process.env.JWT_PASSWORD_RECOVERY_TOKEN_SECRET,
    DEPLOYED_SERVER_FLAG: process.env.DEPLOYED_SERVER_FLAG === "true" ? true : false,
    CORS_CONFIG: cors_config,
    NODE_ENV : process.env.NODE_ENV || "development",

}

export const db_config = {
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
    NEON_CONNECTION_STRING: process.env.NEON_CONNECTION_STRING,
    DEPLOYED_DB_FLAG: process.env.DEPLOYED_DB_FLAG === "true" ? true : false,
    DB_QUERYS: readJson("../configs/querys.json"),
}

export const cloudinary_config = {
    CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET,
}

export const mail_config = {
    APPLICATION_PASSWORD_GMAIL: process.env.APPLICATION_PASSWORD_GMAIL || ""
}

logger.info(`Server, database and mail configurations loaded successfully.`);

