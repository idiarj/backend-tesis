import fs from 'fs';

/**
 * Lee un archivo JSON de forma sincrónica usando import.meta.url como base.
 * @param filePath Ruta relativa al archivo JSON.
 * @returns Objeto JS parseado con tipado genérico.
 */
export function readJson(filePath: string): Record<string, any> {
    // console.log(`Reading JSON file from: ${filePath}`);
    const fullPath = new URL(filePath, import.meta.url);
    //console.log(`Full path resolved: ${fullPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
}
