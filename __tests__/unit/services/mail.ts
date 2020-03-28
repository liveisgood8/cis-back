import { MailService, IMessageOptions } from '../../../src/services/mail';
import { Transporter } from 'nodemailer';
import { config } from '../../../src/config/dev';

describe('mail service - unit', () => {
  it('send', async () => {
    const sendMailMock = jest.fn();
    const mockedTransporter: Partial<Transporter> = {
      sendMail: sendMailMock,
    };
    const service = new MailService(mockedTransporter as Transporter);
    const email: IMessageOptions = {
      body: 'message body',
      subject: 'message subject',
    };
    await service.sendEmail('to@mail.com', email);
    expect(sendMailMock.mock.calls.length).toBe(1);
    expect(sendMailMock.mock.calls[0][0]).toStrictEqual({
      from: config.mail.from,
      to: 'to@mail.com',
      subject: email.subject,
      html: `<p>${email.body}</p>`,
    });
  });
});
