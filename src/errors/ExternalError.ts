import { BaseError } from "./BaseError.js";

export class ExternalError extends BaseError {
    constructor(message: string, statusCode: number = 502, info?: any) {
        super(message, statusCode);
        this.name = "ExternalError";
    }
}
