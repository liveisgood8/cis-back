import { Service } from 'typedi';
import { Repository, getConnection, DeepPartial } from 'typeorm';
import { BusinessRequest } from '../models/request';
import { User } from '../models/user';
import { MailService, IMessageOptions } from './mail';
import { connectionName } from '../loaders/typeorm-loader';

interface IAnswer {
  email: string;
  message: IMessageOptions;
}

@Service()
export class BusinessRequestsService {
  constructor(
    private requestsRepository: Repository<BusinessRequest>,
    private mailService: MailService,
  ) {
  }

  public async getByIdForUser(id: number, userId: number): Promise<BusinessRequest | undefined> {
    return this.requestsRepository.findOne(id, {
      relations: ['contract', 'contract.client'],
      where: {
        user: {
          id: userId,
        },
        isHandled: false,
      },
    });
  }

  public async getForUser(userId: number): Promise<BusinessRequest[]> {
    return this.requestsRepository.find({
      where: {
        user: {
          id: userId,
        },
        isHandled: false,
      },
    });
  }

  public async getPendingCountForUser(userId: number): Promise<number> {
    return this.requestsRepository.count({
      where: {
        user: {
          id: userId,
        },
        isHandled: false,
      },
    });
  }

  public async handle(requestId: number, answer: IAnswer): Promise<void> {
    await getConnection(connectionName).transaction(async (transactionEntityManage) => {
      const request = transactionEntityManage.create(BusinessRequest, {
        id: requestId,
        isHandled: true,
      });
      transactionEntityManage.save(request);
      await this.mailService.sendEmail(answer.email, answer.message);
    });
  }

  public async save(request: DeepPartial<BusinessRequest>): Promise<BusinessRequest> {
    const result = await this.requestsRepository.save(request);
    return result;
  }
}
