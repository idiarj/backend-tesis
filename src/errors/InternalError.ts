import { BaseError } from "./BaseError.js";

export class InternalError extends BaseError {
    constructor(message: string, statusCode: number = 500, info?: string) {
        super(message, statusCode, info);
        this.name = "InternalError";
    }
}