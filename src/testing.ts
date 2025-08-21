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
//         const response = await AnimalService.getAnimals();
//         console.log('Response:', response);
//     } catch (error) {
//         console.error('Error during animal operations:', error);
//     }
// }

// test();


import { AnimalService } from "./services/animalService.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// AnimalService.addAnimal({})


// const insertHospitalizedAnimals = async (animals) => {
//     try {
//         for (const animal of animals) {
//             await AnimalService.addAnimal(animal);
//         }
//     } catch (error) {
//         console.error('Error inserting hospitalized animals:', error);
//     }
// };
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.resolve(__dirname, './cats'); // Change to your images folder

// Read all files in the directory and filter for images
const getAllImages = (dir: string) => {
    const files = fs.readdirSync(dir);
    // Filter for common image extensions
    return files.filter(file =>
        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
    ).map(file => path.join(dir, file));
};

const imagePaths = getAllImages(imagesDir);

 const insertAllAnimalsTest = async () => {
    try {
        for (let index = 0; index < imagePaths.length; index++) {
            const imagePath = imagePaths[index];
            const animal = {
                ruta_imagen_an: imagePath,
                nom_animal: `Hospitalizado ${index + 1}`,
                especie_animal: 'Gato',
                edad_animal: '8 meses',
                genero_animal: 'Hembra',
                peso_animal: 3
            };
            console.log('Inserting animal:', JSON.stringify(animal, null, 2));
            await AnimalService.addAnimal(animal);
            if ((index + 1) % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay cada 10 inserciones
            } else {
                await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s delay
            }
        }
    } catch (error) {
        console.error('Error inserting all animals:', error);
    }
 }

 insertAllAnimalsTest();

//console.log(imagePaths);