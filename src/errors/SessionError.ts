import { InternalError } from "./InternalError.js";

export class SessionError extends InternalError {
    protected info?: string;
    constructor(message: string, statusCode: number, info?: string) {
        super(message, statusCode, info);
        this.name = "SessionError";
        this.info = info ?? "";
    }
}