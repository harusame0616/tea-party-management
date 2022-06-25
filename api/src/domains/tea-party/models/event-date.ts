import { ValueObject } from 'domains/common/value-object';
import { ParameterError } from 'errors/parameter-error';

export interface EventDateParam {
  eventDate: Date;
}

export interface EventDateDto {
  eventDate: string;
}

export class EventDate extends ValueObject<EventDateParam> {
  /**
   * 開催日
   * 10のつく日のみ
   * @param evendDate  YYYY-MM-DD
   */
  static create(eventDate: string) {
    if (!/^[0-9]{4}(-[0-9]{2}){2}$/.test(eventDate)) {
      throw new ParameterError('開催日のフォーマットが異常です。');
    }
    const [_, month, day] = eventDate
      .split('-')
      .map((numStr) => parseInt(numStr));

    if (month < 1 || month > 12) {
      throw new ParameterError('開催月が異常です。');
    }

    if (
      day === 0 ||
      day > 30 ||
      day % 10 !== 0 ||
      (month === 2 && day === 30)
    ) {
      throw new ParameterError('開催日が異常です。');
    }

    return new EventDate({ eventDate: new Date(eventDate) });
  }

  static reconstruct(eventDateDto: EventDateDto) {
    return new EventDate({ eventDate: new Date(eventDateDto.eventDate) });
  }

  /**
   * 開催日をUTC文字列で返す
   */
  get eventDate() {
    return this._value.eventDate.toUTCString();
  }
}
