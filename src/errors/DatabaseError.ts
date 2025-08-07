import { InternalError } from "./InternalError.js";



export class DatabaseError extends InternalError {
    protected info?: string;
    constructor(message: string, statusCode: number = 500, info?: string) {
        super(message, statusCode, info);
        this.name = "DatabaseError";
        this.info = info;
  }
}
