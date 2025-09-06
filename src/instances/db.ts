import { pgManager } from "../database/pgManager.js";
import { db_config } from "../configs/config.js";

const localConfig = {
    host: db_config.DB_HOST,
    port: db_config.DB_PORT,
    user: db_config.DB_USER,
    password: db_config.DB_PASSWORD,
    database: db_config.DB_NAME,
    ssl: db_config.DB_SSL 
};

const deployedConfig = {
    connectionString: db_config.NEON_CONNECTION_STRING,
    ssl: db_config.DB_SSL
};
const config = db_config.DEPLOYED_DB_FLAG ? deployedConfig : localConfig;


export const db = new pgManager({
    querys: db_config.DB_QUERYS,
    config
});


