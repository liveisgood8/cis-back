import { createTransport, Transporter } from 'nodemailer';
import transportConfig from '../../mail.json';

export function makeTransporter(): Transporter {
  const transport = createTransport(transportConfig);
  return transport;
}
