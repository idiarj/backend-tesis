import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Role middleware implementation
    next();
}