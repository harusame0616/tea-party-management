import { ParameterError } from '@/errors/parameter-error';
import { MemberId } from '@/domains/member/models/memberId';

export const statusList = ['participation', 'absence'] as const;
export type Status = typeof statusList[number];

export interface AttendanceParam {
  memberId: MemberId;
  status: Status;
}

export interface AttendanceDto {
  memberId: string;
  status: string;
}

export class Attendance {
  private constructor(private param: AttendanceParam) {}

  static isStatusType(value: any): value is Status {
    return statusList.includes(value);
  }

  static create(param: AttendanceParam) {
    return new Attendance(param);
  }

  absent() {
    this.param.status = 'absence';
  }

  get memberId() {
    return this.param.memberId;
  }

  get status() {
    return this.param.status;
  }

  toDto(): AttendanceDto {
    return {
      memberId: this.param.memberId.memberId,
      status: this.param.status,
    };
  }

  static reconstruct(param: AttendanceDto) {
    if (!Attendance.isStatusType(param.status)) {
      throw new ParameterError('出欠ステータスが不正です。');
    }

    return new Attendance({
      memberId: MemberId.reconstruct({ memberId: param.memberId }),
      status: param.status,
    });
  }
}
