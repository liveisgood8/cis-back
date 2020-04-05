import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

export default (): Mail => {
  /** Make real transport for production */
  return createTransport();
};