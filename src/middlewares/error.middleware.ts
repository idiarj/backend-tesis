import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError.js";

export const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error Middleware Triggered");
    const isKnownError = err instanceof BaseError;
    const statusCode = isKnownError ? err.statusCode : 500;
    const message = isKnownError ? err.message : "Internal Server Error";
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${message}`);
    console.log(err);
    res.status(statusCode).json({
        success: false,
        errorMsg: message
    });
}