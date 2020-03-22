import { createTransport, Transporter } from 'nodemailer';

export function makeTransporter(): Transporter {
  const transport = createTransport({
    // Fill params here
  });
  return transport;
}
