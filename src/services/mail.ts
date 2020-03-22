import { Service } from 'typedi';
import { Transporter } from 'nodemailer';
import { makeTransporter } from '../utils/mail-transport';
import config from '../config';

export interface IMessageOptions {
  subject: string;
  body: string;
}

@Service()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = makeTransporter();
  }

  async sendEmail(to: string, message: IMessageOptions): Promise<void> {
    console.log('send email:', to, message);
    return this.transporter.sendMail({
      from: config.mail.from,
      to,
      subject: message.subject,
      html: `<p>${message.body}</p>`,
    });
  }
}
