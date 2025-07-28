import dotenv from "dotenv";
dotenv.config();


export const server_config = {
    PORT: process.env.PORT || 3000,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    CHANGE_PASSWORD_TOKEN_SECRET: process.env.CHANGE_PASSWORD_TOKEN_SECRET,
    DEPLOYED_SERVER_FLAG: process.env.DEPLOYED_SERVER_FLAG === "true" ? true : false,
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
}

console.log('Configs loaded')
// console.log('Server Config:', server_config);
// console.log('Database Config:', db_config);