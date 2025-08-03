import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError.js";

export const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error Middleware Triggered");
    const isKnownError = err instanceof BaseError;
    const statusCode = isKnownError ? err.statusCode : 500;
    //console.log(isKnownError ? `[${err.name}]` : "[Unknown Error]", err.message);
    const message = isKnownError ? err.message : "Internal Server Error";
    console.error(`[${err.name}] ${req.method} ${req.originalUrl} - ${message} - ${err.info || 'No additional information available'}`);
    console.log(err);
    res.status(statusCode).json({
        success: false,
        errorMsg: message
    });
}