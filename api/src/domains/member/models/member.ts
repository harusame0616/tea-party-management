import { ParameterError } from 'errors/parameter-error';
import { MemberId } from './memberId';

export interface MemberParam {
  memberId: MemberId;
  name: string;
  chatId: string;
}
export interface MemberDto {
  memberId: string;
  name: string;
  chatId: string;
}

export class Member {
  static MAX_NAME_LENGTH = 24;

  private constructor(private param: MemberParam) {}

  public static create(param: Omit<MemberParam, 'memberId'>) {
    return new Member({ ...param, memberId: MemberId.generate() });
  }

  public get memberId() {
    return this.param.memberId;
  }

  public get name() {
    return this.param.name;
  }

  public set name(name: string) {
    if (!name) {
      throw new ParameterError('名前は必須です。');
    }

    if (name.length > Member.MAX_NAME_LENGTH) {
      throw new ParameterError(
        `名前は最大${Member.MAX_NAME_LENGTH}文字以内です。`
      );
    }

    this.param.name = name;
  }

  public get chatId() {
    return this.param.chatId;
  }

  toDto(): MemberDto {
    return {
      memberId: this.param.memberId.memberId,
      name: this.param.name,
      chatId: this.param.chatId,
    };
  }

  static reconstruct(memberDto: MemberDto) {
    return new Member({
      memberId: MemberId.reconstruct({ memberId: memberDto.memberId }),
      name: memberDto.name,
      chatId: memberDto.chatId,
    });
  }
}
