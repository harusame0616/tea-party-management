import { MemberId } from '@/domains/member/models/memberId';

export interface GroupParam {
  memberIds: MemberId[];
}

export interface GroupDto {
  memberIds: string[];
}

export class Group {
  constructor(private param: GroupParam) {}

  toDto(): GroupDto {
    return {
      memberIds: this.param.memberIds.map((memberId) => memberId.memberId),
    };
  }

  static reconstruct(groupDto: GroupDto) {
    return new Group({
      memberIds: groupDto.memberIds.map((memberId) =>
        MemberId.reconstruct({ memberId })
      ),
    });
  }
}
