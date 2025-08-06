export interface MailAuth {
  user: string;
  pass: string;
}

export interface MailPayload {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
  filename: string;
  path: string;
  contentType?: string;
  }[];
}   