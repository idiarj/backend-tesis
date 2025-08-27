export enum Perfil {
  USER = 'Usuario',
  VET = 'Veterinario',
  VET_ADMIN = 'Veterinario Administrador',
  ADMIN = 'Administrador',
  SUPER_ADMIN = 'Super Administrador',
}


export enum Options {
  MED = 'Panel Medico',
  ADMIN = 'Administracion',
}


export type UserPermissions = {
  id_perfil: number;
  perfil: Perfil;
};
