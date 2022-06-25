import { MemberId } from 'domains/member/models/memberId';
import { NotFoundError } from '../../../errors/not-found-error';
import { Attendance, AttendanceDto } from './attendance';
import { EventDate } from './event-date';
import { Group, GroupDto } from './group';
import { TeaPartyId } from './tea-party-id';

export interface TeaPartyParam {
  teaPartyId: TeaPartyId;
  eventDate: EventDate;
  attendances: Attendance[];
  groups: Group[];
}

export interface TeaPartyDto {
  teaPartyId: string;
  eventDate: string;
  attendances: AttendanceDto[];
  groups: GroupDto[];
}

export interface TeaPartyCreateParam
  extends Omit<TeaPartyParam, 'attendances' | 'teaPartyId' | 'groups'> {
  memberIdList: MemberId[];
}

export class TeaParty {
  private constructor(private param: TeaPartyParam) {}
  static create(param: TeaPartyCreateParam) {
    return new TeaParty({
      ...param,
      attendances: param.memberIdList.map(
        (memberId) => Attendance.create({ memberId, status: 'participation' }) // 作成時は出席状態で登録する。
      ),
      teaPartyId: TeaPartyId.generate(),
      groups: [], //作成時にはグループなし
    });
  }

  toDto(): TeaPartyDto {
    return {
      teaPartyId: this.param.teaPartyId.value.teaPartyId,
      attendances: this.param.attendances.map((attendance) =>
        attendance.toDto()
      ),
      eventDate: this.param.eventDate.eventDate,
      groups: this.param.groups.map((group) => group.toDto()),
    };
  }

  static reconstruct(param: TeaPartyDto): TeaParty {
    return new TeaParty({
      teaPartyId: TeaPartyId.reconstruct({ teaPartyId: param.teaPartyId }),
      attendances: param.attendances.map((attendance) =>
        Attendance.reconstruct(attendance)
      ),
      eventDate: EventDate.reconstruct({ eventDate: param.eventDate }),
      groups: param.groups.map((group) =>
        Group.reconstruct({ memberIds: group.memberIds })
      ),
    });
  }
}
