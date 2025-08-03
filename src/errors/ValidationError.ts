import { BaseError } from "./BaseError.js";

export class ValidationError extends BaseError {
    constructor(message: string, statusCode: number = 400, info?: string) {
        super(message, statusCode, info);
        this.name = "ValidationError";
    }
}
