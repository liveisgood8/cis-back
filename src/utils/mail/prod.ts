import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

export default (): Mail => {
  /** Make real transport for production */
  console.log('smtp pass', process.env.SMTP_PASSWORD);
  return createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'lemeshonok12@yandex.ru',
      pass: process.env.SMTP_PASSWORD,
    },
  });
};
