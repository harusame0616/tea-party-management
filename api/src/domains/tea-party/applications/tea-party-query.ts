import { EventDate } from '../models/event-date';

export interface TeaPartyDetailQueryParam {
  teaPartyQuery: TeaPartyQuery;
}

export interface TeaPartyDetailDto {
  teaPartyId: string;
  eventDate: Date;
  attendances: {
    status: string;
    memberId: string;
  };
  groups: {
    groupId: string;
    memberIds: string[];
  }[];
}

export interface TeaPartyQuery {
  teaPartyDetailByEventDate(
    eventDate: EventDate
  ): Promise<TeaPartyDetailDto | null>;

  listEventDate(): Promise<Date[]>;
}
