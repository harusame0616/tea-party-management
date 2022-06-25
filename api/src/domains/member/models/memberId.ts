import { ValueObject } from 'domains/common/value-object';
import { uuidv7 as uuid } from 'uuidv7';

interface MemberIdDto {
  memberId: string;
}

export class MemberId extends ValueObject<MemberIdDto> {
  static generate() {
    return new MemberId({ memberId: uuid() });
  }

  static reconstruct(param: MemberIdDto) {
    return new MemberId(param);
  }

  get memberId() {
    return this._value.memberId;
  }
}
