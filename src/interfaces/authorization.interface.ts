export enum Perfil {
  USER = 'Usuario',
  VET = 'Veterinario',
  VET_ADMIN = 'Veterinario Administrador',
  ADMIN = 'Administrador',
  SUPER_ADMIN = 'Super Administrador',
}


export type UserPermissions = {
  id_perfil: number;
  perfil: Perfil;
};
