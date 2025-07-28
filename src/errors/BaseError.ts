

export class BaseError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500, info?: string) {
        super(message);
        this.name = "BaseError";
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}