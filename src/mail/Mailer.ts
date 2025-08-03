import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { MailAuth, MailPayload } from '../interfaces/mailer.interface.js';
import { MailerError } from '../errors/MailerError.js';
import { InternalError } from '../errors/InternalError.js';



export class Mailer {
  private auth: MailAuth;
  private secure: boolean;

  constructor(auth: MailAuth, secure: boolean) {
    this.auth = auth;
    this.secure = secure;
  }

  private async createTransport(): Promise<Transporter> {
    const port = this.secure ? 465 : 587;

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port,
      secure: this.secure,
      auth: this.auth,
    });
  }

  public async sendEmail(payload: MailPayload): Promise<void> {
    try {
      const { from, to, subject, text, attachments = [] } = payload;
      const transporter = await this.createTransport();

      const mailOptions: SendMailOptions = {
        from,
        to,
        subject,
        text,
        attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado con éxito:', info.response);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new MailerError('Error al enviar el correo', 500, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  public async sendTemplate(payload: MailPayload): Promise<void> {
    try {
      const { from, to, subject, html, attachments = [] } = payload;
      const transporter = await this.createTransport();

      const mailOptions: SendMailOptions = {
        from,
        to,
        subject,
        html,
        attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Correo con template enviado con éxito:', info.response);
    } catch (error) {
      console.error('Error enviando template:', error);
      throw new MailerError('Error al enviar el correo.', 500, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
