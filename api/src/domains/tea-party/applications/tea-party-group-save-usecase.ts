import { MemberRepository } from '@/domains/member/applications/member-repository';
import { MemberId } from '@/domains/member/models/memberId';
import { NotFoundError } from '@/errors/not-found-error';
import { EventDate } from '../models/event-date';
import { Group, GroupDto } from '../models/group';
import { TeaPartyNotificationGateway } from './tea-party-notification-gateway';
import { TeaPartyRepository } from './tea-party-repository';

interface TeaPartyAttendanceUsecaseExecParam {
  eventDate: string;
  groups: GroupDto[];
}

interface TeaPartyGroupSaveUsecaseParam {
  teaPartyRepository: TeaPartyRepository;
  memberRepository: MemberRepository;
  teaPartyNotificationGateway: TeaPartyNotificationGateway;
}

export class TeaPartyGroupSaveUsecase {
  constructor(private param: TeaPartyGroupSaveUsecaseParam) {}
  async execute(param: TeaPartyAttendanceUsecaseExecParam) {
    const [teaParty] = await Promise.all([
      this.param.teaPartyRepository.findOneByEventDate(
        EventDate.create(param.eventDate)
      ),
    ]);

    if (!teaParty) {
      throw new NotFoundError('お茶会');
    }

    teaParty.setGroups(
      param.groups.map((group) =>
        Group.create({
          memberIds: group.memberIds.map((memberId) =>
            MemberId.create({ memberId })
          ),
        })
      )
    );

    const [members] = await Promise.all([
      this.param.memberRepository.listAll(),
      this.param.teaPartyRepository.update(teaParty),
    ]);

    await this.param.teaPartyNotificationGateway.notifyGroups(
      teaParty,
      members
    );
  }
}
