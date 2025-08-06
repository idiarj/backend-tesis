import { DatabaseError } from "./DatabaseError.js";

export class ConnectionError extends DatabaseError {
    protected info?: string;
    constructor(message: string, statusCode: number = 500, info?: string) {
        super(message, statusCode, info);
        this.name = "ConnectionError";
        this.info = info ?? "";
    }
}