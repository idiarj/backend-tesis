import { BaseError } from "./BaseError.js";

export class AuthError extends BaseError {
    protected info?: string;
    constructor(message: string, statusCode: number = 401, info?: string) {
        super(message, statusCode, info);
        this.name = "AuthError";
        this.info = info ?? "";
    }
}