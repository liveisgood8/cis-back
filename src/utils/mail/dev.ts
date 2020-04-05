import { createTransport, Transporter } from 'nodemailer';

export default (): Transporter => {
  return createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '7b6538a5845234',
      pass: 'd554ba4ed19353',
    },
  });
};
