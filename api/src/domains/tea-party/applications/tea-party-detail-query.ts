import { EventDate } from '../models/event-date';
import { TeaPartyDetailQueryParam } from './tea-party-query';

export class TeaPartyDetailQuery {
  constructor(private param: TeaPartyDetailQueryParam) {}

  async execute(eventDate: string) {
    return await this.param.teaPartyQuery.teaPartyDetailByEventDate(
      EventDate.create(eventDate)
    );
  }
}
