import { readJson } from "../utils/readJson.js";
import { pgManager } from "../database/pgManager.js";
import { db_config } from "../configs/config.js";


const querys = readJson("../configs/querys.json");
// console.log("Querys loaded:", querys);

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

// console.log("Local DB Config:", localConfig);
// console.log("Deployed DB Config:", deployedConfig);
console.log("Estoy con la base de datos desplegada?", db_config.DEPLOYED_DB_FLAG);

const config = db_config.DEPLOYED_DB_FLAG ? deployedConfig : localConfig;   



export const db = new pgManager({
    querys,
    config
});  