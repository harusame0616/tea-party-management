import { EventDate } from '../models/event-date';
import { TeaParty } from '../models/tea-party';

export interface TeaPartyRepository {
  insert(newTeaParty: TeaParty): Promise<void>;
  findOneByEventDate(eventDate: EventDate): Promise<TeaParty | null>;
}
