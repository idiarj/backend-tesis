import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError.js";

import { getLogger } from "../utils/logger.js";

const logger = getLogger('ERROR');

export const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error("Error Middleware Triggered");
    const isKnownError = err instanceof BaseError;
    const statusCode = isKnownError ? err.statusCode : 500;
    const message = isKnownError ? err.message : "Internal Server Error";
    logger.error(`[${err.name}] ${req.method} ${req.originalUrl} - ${message} - ${err.info || 'No additional information available'}`);
    // if (err.stack) {
    //     logger.error(`Stack trace: ${err.stack}`);
    // }
    res.status(statusCode).json({
        success: false,
        errorMsg: message
    });
}