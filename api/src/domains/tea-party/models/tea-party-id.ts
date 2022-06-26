import { uuidv7 } from 'uuidv7';
import { ValueObject } from 'domains/common/value-object';

export interface TeaPartyIdParam {
  teaPartyId: string;
}

export class TeaPartyId extends ValueObject<TeaPartyIdParam> {
  static generate() {
    return new TeaPartyId({ teaPartyId: uuidv7() });
  }

  static reconstruct(param: TeaPartyIdParam) {
    return new TeaPartyId(param);
  }

  get teaPartyId() {
    return this._value.teaPartyId;
  }
}
