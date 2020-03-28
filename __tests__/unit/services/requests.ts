import { createMockedRepository } from '../../test-utils/mockedRepo';
import { BusinessRequestsService } from '../../../src/services/requests';
import { BusinessRequest } from '../../../src/models/request';
import { MailService, IMessageOptions } from '../../../src/services/mail';
import { Transporter } from 'nodemailer';
import { getConnection } from 'typeorm';

describe('contracts service - unit', () => {
  let realTypeormGetConnection: typeof getConnection;
  let service: BusinessRequestsService;
  const repoMock = createMockedRepository<BusinessRequest>();

  beforeEach(() => {
    repoMock.reset();
    service = new BusinessRequestsService(
        repoMock.repository,
        new MailService({} as Transporter));
  });

  beforeAll(() => {
    realTypeormGetConnection = getConnection;
  });

  afterAll(() => {
    (getConnection as any) = realTypeormGetConnection;
  });

  it('get by id for user', async () => {
    // test only call args
    await service.getByIdForUser(10, 65);
    expect(repoMock.mocks.findOne.mock.calls.length).toBe(1);
    expect(repoMock.mocks.findOne.mock.calls[0][0]).toBe(10);
    expect(repoMock.mocks.findOne.mock.calls[0][1]).toStrictEqual({
      relations: ['contract', 'contract.client'],
      where: {
        user: {
          id: 65,
        },
        isHandled: false,
      },
    });
  });

  it('get for user', async () => {
    // test only call args
    await service.getForUser(34);
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(repoMock.mocks.find.mock.calls[0][0]).toStrictEqual({
      where: {
        user: {
          id: 34,
        },
        isHandled: false,
      },
    });
  });

  it('get pending count for user', async () => {
    // test only call args
    await service.getPendingCountForUser(34);
    expect(repoMock.mocks.count.mock.calls.length).toBe(1);
    expect(repoMock.mocks.count.mock.calls[0][0]).toStrictEqual({
      where: {
        user: {
          id: 34,
        },
        isHandled: false,
      },
    });
  });

  it('handle', async () => {
    const sendMailMock = jest.fn();
    const mockedMailService = new MailService({} as Transporter);
    mockedMailService.sendEmail = sendMailMock;

    service = new BusinessRequestsService(repoMock.repository,
        mockedMailService);

    const transactionMock = jest.fn();
    (getConnection as any) = jest.fn().mockReturnValue({
      transaction: transactionMock,
    });

    const request = new BusinessRequest();
    request.id = 3;
    request.isHandled = true;

    const message: IMessageOptions = {
      body: 'message body',
      subject: 'message subject',
    };

    await service.handle(request.id, {
      email: 'mail@mail.com',
      message,
    });

    expect(transactionMock.mock.calls.length).toBe(1);
    expect(typeof transactionMock.mock.calls[0][0] === 'function').toBe(true);

    const transactionCallback = transactionMock.mock.calls[0][0];
    const transactionEntityManagerMock = {
      create: jest.fn().mockReturnValue(request),
      save: jest.fn(),
    };
    await transactionCallback(transactionEntityManagerMock);
    expect(transactionEntityManagerMock.create.mock.calls.length).toBe(1);
    expect(transactionEntityManagerMock.save.mock.calls.length).toBe(1);
    expect(transactionEntityManagerMock.create.mock.calls[0][0]).toBe(BusinessRequest);
    expect(transactionEntityManagerMock.create.mock.calls[0][1]).toStrictEqual({
      id: request.id,
      isHandled: request.isHandled,
    });

    expect(transactionEntityManagerMock.save.mock.calls[0][0]).toStrictEqual(request);
    expect(sendMailMock.mock.calls.length).toBe(1);
    expect(sendMailMock.mock.calls[0][0]).toBe('mail@mail.com');
    expect(sendMailMock.mock.calls[0][1]).toStrictEqual(message);
  });

  it('save', async () => {
    // test only call args
    const realRequest: Partial<BusinessRequest> = {
      id: 5,
      message: 'new message',
      isHandled: true,
    };
    await service.save(realRequest);
    expect(repoMock.mocks.save.mock.calls.length).toBe(1);
    expect(repoMock.mocks.save.mock.calls[0][0]).toStrictEqual(realRequest);
  });
});
