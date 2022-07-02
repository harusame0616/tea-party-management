import { uuidv7 } from 'uuidv7';
import { ValueObject } from '@/domains/common/value-object';

export interface TeaPartyIdParam {
  teaPartyId: string;
}

export interface TeaPartyIdDto extends TeaPartyIdParam {}

export class TeaPartyId extends ValueObject<TeaPartyIdParam> {
  static generate() {
    return new TeaPartyId({ teaPartyId: uuidv7() });
  }

  static create(param: TeaPartyIdParam) {
    return new TeaPartyId({ teaPartyId: param.teaPartyId });
  }

  static reconstruct(param: TeaPartyIdDto) {
    return new TeaPartyId(param);
  }

  get teaPartyId() {
    return this._value.teaPartyId;
  }
}
