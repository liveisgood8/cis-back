import { createTransport, Transporter } from 'nodemailer';

export default (): Transporter => {
  return createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};
