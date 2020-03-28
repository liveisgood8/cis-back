import { Service } from 'typedi';
import { Transporter } from 'nodemailer';
import config from '../config';

export interface IMessageOptions {
  subject: string;
  body: string;
}

@Service()
export class MailService {
  constructor(private transporter: Transporter) {
  }

  async sendEmail(to: string, message: IMessageOptions): Promise<void> {
    return this.transporter.sendMail({
      from: config.mail.from,
      to,
      subject: message.subject,
      html: `<p>${message.body}</p>`,
    });
  }
}
