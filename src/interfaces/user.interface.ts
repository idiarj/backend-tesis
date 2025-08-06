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
        error: 'El nombre de usuario debe contener solamente texto y no puede estar vacio.',
    }).trim().min(3,{
            error: (iss)=>{
                return `El nombre de usuario debe tener minimo ${iss.minimum} caracteres.`
            }
        }
    ).max(15, {
        error: (iss)=>{
            return `El nombre de usuario debe tener maximo ${iss.maximum} caracteres.`
        }
    }).nonempty({
        message: "El nombre de usuario es obligatorio."
    }),
    pwd_usuario: z.string({
        error: 'La contrasena debe contener solo texto.'
    }).trim().min(5, {
        error: (iss)=>{
            return `La contrasena debe tener un minimo de ${iss.minimum} caracteres.`
        }
    }).max(16, {
        error: (iss)=>{
            return `La contrasena debe tener un maximo de ${iss.maximum} caracteres.`
        }
    }).nonempty({
        message: "La contrasena es obligatoria."
    }),
    email_usuario: z.email({
        error: 'El campo email debe ser un email valido.'
    }).trim().nonempty({
        message: "El email es obligatorio."
    }),
    tlf_usuario: z.string({
        error: 'El numero telefonico debe contener solo texto.'
    }).trim().nonempty({
        message: "El numero telefonico es obligatorio."
    }).min(10, {
        message: "El numero telefonico debe tener 10 caracteres."
    }).max(10, {    
        message: "El numero telefonico debe tener un maximo de 15 caracteres."
    })  
})


export const loginCredentialsSchema = z.object({
    identifier_usuario: z.string({
        error: 'El nombre de usuario o correo debe contener solamente texto y no puede estar vacio.',
    }).trim().nonempty({
        message: "El identificador de usuario es obligatorio."
    }),
    pwd_usuario: z.string({
        error: 'La contrasena debe contener solamente texto y no puede estar vacio.',
    }).trim().nonempty({
        message: "La contrasena es obligatoria."
    })
})