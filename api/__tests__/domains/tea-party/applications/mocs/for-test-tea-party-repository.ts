import { NotFoundError } from '@/errors/not-found-error';
import { TeaPartyRepository } from 'domains/tea-party/applications/tea-party-repository';
import { EventDate } from 'domains/tea-party/models/event-date';
import { TeaParty, TeaPartyDto } from 'domains/tea-party/models/tea-party';

export class ForTestTeaPartyRepository implements TeaPartyRepository {
  teaParties: TeaPartyDto[];

  constructor(teaParties: TeaPartyDto[] = []) {
    this.teaParties = teaParties;
  }

  async insert(newTeaParty: TeaParty): Promise<void> {
    const dto = newTeaParty.toDto();
    this.teaParties.push(dto);
  }

  async update(teaParty: TeaParty): Promise<void> {
    const dto = teaParty.toDto();
    const index = this.teaParties.findIndex(
      (teaParty) => teaParty.teaPartyId === dto.teaPartyId
    );
    if (index < 0) {
      throw new NotFoundError('お茶会');
    }

    this.teaParties.splice(index, 1, dto);
  }

  async findOneByEventDate(eventDate: EventDate): Promise<TeaParty | null> {
    const teaPartyDto = this.teaParties.find(
      (teaParty) =>
        EventDate.reconstruct({ eventDate: teaParty.eventDate }).eventDate ===
        eventDate.eventDate
    );

    return teaPartyDto ? TeaParty.reconstruct(teaPartyDto) : null;
  }
}
