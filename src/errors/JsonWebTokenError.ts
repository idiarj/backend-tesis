import { BaseError } from "./BaseError.js";

export class JsonWebTokenError extends BaseError {
    protected info?: string;
    constructor(message: string, statusCode: number = 403, info?: string) {
        super(message, statusCode, info);
        this.name = "JsonWebTokenError";
        this.info = info ?? "";
    }
}
