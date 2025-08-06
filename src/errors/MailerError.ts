import { InternalError } from "./InternalError.js";


export class MailerError extends InternalError {
  protected info?: string;
  constructor(message: string, statusCode?: number, info?: string) {
    super(message, statusCode, info);
    this.name = 'MailerError';
    this.info = info ?? "";
  }
}