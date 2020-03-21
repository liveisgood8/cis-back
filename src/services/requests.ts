import Container, { Service } from 'typedi';
import { Repository, getConnection, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BusinessRequest } from '../models/request';
import { User } from '../models/user';
import { MailService } from './mail';

interface IAnswer {
  email: string;
  message: string;
}

@Service()
export class BusinessRequestsService {
  private mailService: MailService;

  constructor(
    private requestsRepository: Repository<BusinessRequest>,
  ) {
    this.mailService = Container.get(MailService);
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
    const user = new User();
    user.id = userId;

    return this.requestsRepository.find({
      where: {
        user: user,
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
    await getConnection().transaction(async (transactionEntityManage) => {
      const request = transactionEntityManage.create(BusinessRequest, {
        id: requestId,
        isHandled: true,
      });
      transactionEntityManage.save(request);
      this.mailService.sendEmail(answer.email, answer.message);
    });
  }

  public async save(request: DeepPartial<BusinessRequest>): Promise<BusinessRequest> {
    const result = await this.requestsRepository.save(request);
    return result;
  }
}
