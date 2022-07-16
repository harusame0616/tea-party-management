import { MemberRepository } from '@/domains/member/applications/member-repository';
import { ConflictError } from '@/errors/conflict-error';
import { NotFoundError } from '@/errors/not-found-error';
import { TeaPartyCreateService } from '../domain-services/tea-party-create-service';
import { EventDate } from '../models/event-date';
import { TeaPartyNotificationGateway } from './tea-party-notification-gateway';
import { TeaPartyRepository } from './tea-party-repository';

interface TeaPartyCreateMostRecentUsecaseExecuteParam {
  today: Date;
}

export class TeaPartyCreateMostRecentUsecase {
  constructor(
    private teaPartyRepository: TeaPartyRepository,
    private memberRepository: MemberRepository,
    private teaPartyNotificationGateway: TeaPartyNotificationGateway
  ) {}

  async execute(param: TeaPartyCreateMostRecentUsecaseExecuteParam) {
    const teaPartyCreateService = new TeaPartyCreateService(
      this.memberRepository
    );

    const eventDate = EventDate.mostRecent(param.today);
    const limitDate = new Date(param.today.getTime());
    limitDate.setDate(limitDate.getDate() + 7);
    if (new Date(eventDate.eventDate) > limitDate) {
      throw new NotFoundError('作成可能な直近のお茶会');
    }

    const createdTeaParty = await this.teaPartyRepository.findOneByEventDate(
      eventDate
    );
    if (createdTeaParty) {
      throw new ConflictError('お茶会は作成済みです。');
    }

    const newTeaParty = await teaPartyCreateService.create({ eventDate });
    await this.teaPartyRepository.insert(newTeaParty);
    await this.teaPartyNotificationGateway.notifyAttendanceConfirmation(
      newTeaParty
    );
  }
}
