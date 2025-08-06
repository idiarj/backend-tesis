import { BaseError } from "./BaseError.js";

export class ForbiddenError extends BaseError {
    protected info?: string;
    constructor(message: string, statusCode: number = 403, info?: any) {
        super(message, statusCode);
        this.name = "ForbiddenError";
        this.info = info ?? "";
    }
}
