import { BaseError } from "./BaseError.js";

export class ExternalError extends BaseError {
    constructor(message: string, statusCode: number = 502, info?: string) {
        super(message, statusCode, info);
        this.name = "ExternalError";
    }
}
