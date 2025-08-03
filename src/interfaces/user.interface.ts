import z from 'zod';

export interface User {
    id_usuario?: number;
    nom_usuario: string;
    pwd_usuario: string;
    email_usuario: string;
    tlf_usuario: string;
    id_perfil?: number;
}

export interface LoginCredentials {
    pwd_usuario: string;
    identifier_usuario: string; // This can be either nom_usuario or email_usuario
}



export const userSchema = z.object({
    nom_usuario: z.string({
        error: 'El nombre de usuario debe ser un string.'
    }).min(3,{
            error: (iss)=>{
                return `El nombre de usuario debe tener minimo ${iss.minimum} caracteres.`
            }
        }
    ).max(15, {
        error: (iss)=>{
            return `El nombre de usuario debe tener maximo ${iss.maximum} caracteres.`
        }
    }),
    pwd_usuario: z.string({
        error: 'La contrasena debe ser un string.'
    }).min(5, {
        error: (iss)=>{
            return `La contrasena debe tener un minimo de ${iss.minimum} caracteres.`
        }
    }).max(16, {
        error: (iss)=>{
            return `La contrasena debe tener un maximo de ${iss.maximum} caracteres.`
        }
    }),
    email_usuario: z.email({
        error: 'El campo email debe ser un email valido.'
    }),
    tlf_usuario: z.string({
        error: 'El numero telefonico debe ser un string.'
    })
})