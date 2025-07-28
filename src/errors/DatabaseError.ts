import { InternalError } from "./InternalError.js";



export class DatabaseError extends InternalError {
    public info?: any;
    constructor(message: string, statusCode: number = 500, info?: string) {
        super(message, statusCode, info);
        this.name = "DatabaseError";
        this.info = info;
    }
}