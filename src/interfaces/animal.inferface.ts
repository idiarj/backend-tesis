import zod from 'zod';

export interface Animal {
    ruta_imagen_an?: string;
    id_animal?: number;
    nom_animal: string;
    especie_animal: string;
    edad_animal: string;
    genero_animal: string;
    peso_animal: number;
}

export interface AnimalRequest {
    id_acogida?: number;
    id_usuario: number;
    id_animal: number;
    id_tipo_acogida: number;
    id_acogida_est: number;
    fecha_acogida?: Date;
}

export const AnimalSchema = zod.object({
    ruta_imagen_an: zod.url().optional(),
    nom_animal: zod.string().trim().min(1,
        {
            error: 'El nombre del animal no puede estar vacio.'
        }).max(20, {
            error: (iss)=>{
                return `El nombre del animal debe tener un maximo de ${iss.maximum} caracteres.
                `}
    }),
    especie_animal: zod.string().min(2, {
        error: (iss)=>{
            return `La especie del animal debe tener un minimo de ${iss.minimum} caracteres.`
        }
    }).max(100, {
        error: (iss)=>{
            return `La especie del animal debe tener un maximo de ${iss.maximum} caracteres.`
        }
    }),
    edad_animal: zod.string().min(1, {
        error: (iss)=>{
            return `La edad del animal debe tener un minimo de ${iss.minimum} caracteres.`
        }
    }).max(10, {
        error: (iss)=>{
            return `La edad del animal debe tener un maximo de ${iss.maximum} caracteres.`
        }
    }),
    genero_animal: zod.string().min(1, {
        error: (iss)=>{
            return `El genero del animal debe tener un minimo de ${iss.minimum} caracteres.`
        }
    }).max(10, {
        error: (iss)=>{
            return `El genero del animal debe tener un maximo de ${iss.maximum} caracteres.`
        }
    }),
    peso_animal: zod.number({
        error: 'El peso del animal debe ser un numero.'
    }).min(0)
});
