import { MemberId } from '@/domains/member/models/memberId';
import { ParameterError } from '@/errors/parameter-error';

export interface GroupParam {
  memberIds: MemberId[];
}

export interface GroupDto {
  memberIds: string[];
}

interface GroupCreateParam {
  memberIds: MemberId[];
}

export class Group {
  constructor(private param: GroupParam) {}

  get memberIds() {
    return [...this.param.memberIds];
  }

  static create(param: GroupCreateParam) {
    if (
      new Set(param.memberIds.map((memberId) => memberId.memberId)).size <
      param.memberIds.length
    ) {
      throw new ParameterError('メンバーIDが重複しています');
    }

    return new Group(param);
  }

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
