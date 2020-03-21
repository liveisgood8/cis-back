import { Service } from 'typedi';

@Service()
export class MailService {
  sendEmail(to: string, messageBody: string): void {
    // TODO
  }
}
