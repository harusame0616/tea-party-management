import { MemberRepository } from '@/domains/member/member-repository';
import { MemberId } from '@/domains/member/models/memberId';
import { NotFoundError } from '@/errors/not-found-error';
import { EventDate } from '../models/event-date';
import { TeaPartyRepository } from './tea-party-repository';

interface TeaPartyAbsenceUsecaseExecParam {
  eventDate: string;
  chatId: string;
}

interface TeaPartyAbsenceUsecaseParam {
  teaPartyRepository: TeaPartyRepository;
  memberRepository: MemberRepository;
}

export class TeaPartyAbsenceUsecase {
  constructor(private param: TeaPartyAbsenceUsecaseParam) {}
  async execute(param: TeaPartyAbsenceUsecaseExecParam) {
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

    teaParty.absent(member.memberId);

    await this.param.teaPartyRepository.update(teaParty);
  }
}
