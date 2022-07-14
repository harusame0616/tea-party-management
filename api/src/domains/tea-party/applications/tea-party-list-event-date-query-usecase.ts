import { EventDate } from '../models/event-date';
import { TeaPartyDetailQueryParam } from './tea-party-query';

export class TeaPartyListEventDateQueryUsecase {
  constructor(private param: TeaPartyDetailQueryParam) {}

  async execute() {
    return await this.param.teaPartyQuery.listEventDate();
  }
}
