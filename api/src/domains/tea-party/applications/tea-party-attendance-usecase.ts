import { MemberRepository } from '@/domains/member/member-repository';
import { NotFoundError } from '@/errors/not-found-error';
import { EventDate } from '../models/event-date';
import { TeaPartyRepository } from './tea-party-repository';

interface TeaPartyAttendanceUsecaseExecParam {
  eventDate: string;
  chatId: string;
}

interface TeaPartyAttendanceUsecaseParam {
  teaPartyRepository: TeaPartyRepository;
  memberRepository: MemberRepository;
}

export class TeaPartyAttendanceUsecase {
  constructor(private param: TeaPartyAttendanceUsecaseParam) {}
  async execute(param: TeaPartyAttendanceUsecaseExecParam) {
    const eventDate = EventDate.create(param.eventDate);

    const [teaParty, member] = await Promise.all([
      this.param.teaPartyRepository.findOneByEventDate(eventDate),
      this.param.memberRepository.findOneByChatId(param.chatId),
    ]);

    if (!teaParty) {
      throw new NotFoundError('お茶会');
    }
    if (!member) {
      throw new NotFoundError('メンバー');
    }

    teaParty.attend(member.memberId);

    await this.param.teaPartyRepository.update(teaParty);
  }
}
