
import { promises as fs } from 'fs';

/**
 * Lee un archivo .json y lo devuelve como objeto JS
 * @param {string} filePath - Ruta al archivo .json
 * @returns {Promise<any>} - Objeto JS parseado
 */
export async function readJson(filePath: string): Promise<any> {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}
