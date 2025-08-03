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


export const mail_config = {
    APPLICATION_PASSWORD_GMAIL: process.env.APPLICATION_PASSWORD_GMAIL || "",
    EMAIL_TEMPLATE: `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <title>Recuperar contraseña - Gato Feliz</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #fff9db; font-family: Arial, sans-serif;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
                <!-- Header -->
                <tr>
                <td align="center" style="background-color: #fff9db; padding: 20px;">
                    <img src="../assets/photo_2025-08-03_02-15-26.jpg" alt="Logo Gato Feliz" width="80" height="80" style="display:block;" />
                    <h2 style="margin: 10px 0 0; color: #F37021;">Recuperar tu contraseña</h2>
                </td>
                </tr>

                <!-- Cuerpo -->
                <tr>
                <td style="padding: 30px 40px; color: #333;">
                    <p style="font-size: 16px; margin: 0 0 12px;">
                    ¡Hola! Hemos recibido una solicitud para restablecer tu contraseña en <strong>Gato Feliz Venezuela</strong>.
                    </p>
                    <p style="font-size: 15px; margin: 0 0 20px;">
                    Para continuar, haz clic en el botón de abajo. Este enlace es válido por 30 minutos.
                    </p>

                    <!-- Botón -->
                    <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="border-radius: 30px;" bgcolor="#F37021">
                        <a
                            href="{{link}}"
                            target="_blank"
                            style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block; border-radius: 30px;"
                        >
                            Restablecer Contraseña
                        </a>
                        </td>
                    </tr>
                    </table>

                    <p style="font-size: 13px; color: #999; margin-top: 24px;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual seguirá funcionando.
                    </p>
                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td align="center" style="background-color: #fff9db; padding: 16px; font-size: 13px; color: #666;">
                    Fundación Gato Feliz Venezuela 🐾<br />
                    Síguenos en Instagram: <strong>@gatofelizvenezuela</strong>
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    </body>
    </html>`
}

logger.info(`Server, database and mail configurations loaded successfully.`);

