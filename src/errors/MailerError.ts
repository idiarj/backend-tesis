import { InternalError } from "./InternalError.js";


export class MailerError extends InternalError {
  constructor(message: string, statusCode?: number, info?: string) {
    super(message, statusCode, info);
    this.name = 'MailerError';
  }
}