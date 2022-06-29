import { GcsRepository } from '@/domains/common/infrastracture/gcs-repository';
import { TeaPartyRepository } from '../../applications/tea-party-repository';
import { EventDate } from '../../models/event-date';
import { TeaParty } from '../../models/tea-party';

export class GcsTeaPartyRepository
  extends GcsRepository
  implements TeaPartyRepository
{
  get basePath(): string {
    return 'tea-party';
  }

  async insert(newTeaParty: TeaParty): Promise<void> {
    const teaPartyDto = newTeaParty.toDto();

    await this.save(
      new Date(teaPartyDto.eventDate).getTime() + '.json',
      JSON.stringify(teaPartyDto),
      {
        checkExists: true,
      }
    );
  }

  async update(teaParty: TeaParty): Promise<void> {
    const teaPartyDto = teaParty.toDto();

    await this.save(
      new Date(teaPartyDto.eventDate).getTime() + '.json',
      JSON.stringify(teaPartyDto)
    );
  }

  async findOneByEventDate(eventDate: EventDate): Promise<TeaParty | null> {
    const data = await this.load(
      new Date(eventDate.eventDate).getTime() + '.json'
    );
    return data ? TeaParty.reconstruct(JSON.parse(data)) : null;
  }
}
