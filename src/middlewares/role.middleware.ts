// src/middleware/authorization.ts
import { Request, Response, NextFunction } from 'express';
import { Perfil } from '../interfaces/authorization.interface.js';
import { getLogger } from '../utils/logger.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

const logger = getLogger('AUTHORIZATION_MIDDLEWARE');

export const authorizationMidd =
  (...allowedRoles: Perfil[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    // logger.debug('User:', user);
    // logger.debug('Profiles:', profiles);
    // logger.debug('AllowedRoles:', allowedRoles);
    logger.debug(`${JSON.stringify(user)}`);
    logger.debug(`User with profile ${user?.perfil} is trying to access a resource that requires one of the following roles: ${allowedRoles.join(', ')}`);

    if (
      user && user.perfil && allowedRoles.includes(user.perfil)
    ) {
      next();
    } else {
      throw new ForbiddenError('No tienes permisos para acceder a este recurso', 403, `El usuario con perfil ${user?.perfil} no tiene acceso a este recurso`);
    }
};