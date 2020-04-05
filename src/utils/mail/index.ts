import { Transporter } from 'nodemailer';
import dev from './dev';
import prod from './prod';

export function makeTransporter(): Transporter {
  if (process.env.NODE_ENV !== 'production') {
    return dev();
  } else {
    return prod();
  }
}
