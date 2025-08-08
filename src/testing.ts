// import path, { sep } from 'path';
// import { fileURLToPath } from 'url';
// import ImageService from "./services/imageService.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const imagePath = path.resolve(__dirname, './assets/photo_2025-08-03_02-15-26.jpg');

// async function test() {
//     try {
//         const result = await ImageService.uploadImage(imagePath);
//         console.log('Upload result:', result);
//     } catch (error) {
//         console.error('Error during image operations:', error);
//     }
// }

// test();

// import { AnimalService } from "./services/animalService.js";

// async function test() {
//     try {
//         const response = await AnimalService.getAllAnimals();
//         console.log('Response:', response);
//     } catch (error) {
//         console.error('Error during animal operations:', error);
//     }
// }

// test();


import { db } from "./instances/db.js";


const test = async () => {
    try {
        const result = await db.executeRawQuery(`SELECT id_usuario, nom_usuario, u.id_perfil, des_perfil, op.id_opcion, des_opcion FROM usuario u
        INNER JOIN perfil per ON u.id_perfil = per.id_perfil
        INNER JOIN perfil_opcion perop ON per.id_perfil = perop.id_perfil
        INNER JOIN opcion op ON  perop.id_opcion = op.id_opcion WHERE id_usuario = $1`, [16])
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error during database operations:', error);
    }
}


test();