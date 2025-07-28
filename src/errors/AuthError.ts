import { BaseError } from "./BaseError.js";

export class AuthError extends BaseError {
    constructor(message: string, statusCode: number = 401, info?: any) {
        super(message, statusCode, info);
        this.name = "AuthError";
    }
}