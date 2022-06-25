import { ConflictError } from 'errors/conflict-error';
import { MemberRepository } from '../../member/member-repository';
import { TeaPartyCreateService } from '../domain-services/tea-party-create-service';
import { EventDate } from '../models/event-date';
import { TeaPartyNotificationGateway } from './tea-party-notification-gateway';
import { TeaPartyRepository } from './tea-party-repository';

interface TeaPartyCreateUsecaseExecuteParam {
  eventDate: string;
}

export class TeaPartyCreateUsecase {
  constructor(
    private teaPartyRepository: TeaPartyRepository,
    private memberRepository: MemberRepository,
    private teaPartyNotificationGateway: TeaPartyNotificationGateway
  ) {}

  async execute(param: TeaPartyCreateUsecaseExecuteParam) {
    const teaPartyCreateService = new TeaPartyCreateService(
      this.memberRepository
    );

    const eventDate = EventDate.create(param.eventDate);
    const createdTeaParty = await this.teaPartyRepository.findOneByEventDate(
      eventDate
    );
    if (createdTeaParty) {
      throw new ConflictError('指定日のお茶会は作成済みです。');
    }

    const newTeaParty = await teaPartyCreateService.create({ eventDate });
    await this.teaPartyRepository.insert(newTeaParty);
    await this.teaPartyNotificationGateway.notifyAttendanceConfirmation(
      newTeaParty
    );
  }
}
