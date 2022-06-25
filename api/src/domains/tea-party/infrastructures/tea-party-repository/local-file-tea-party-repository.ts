import { TeaPartyRepository } from '../../applications/tea-party-repository';
import { EventDate } from '../../models/event-date';
import { TeaParty } from '../../models/tea-party';
import fs from 'fs/promises';
import path from 'path';

const DIR = path.join('.store', 'tea-party');
export class LocalFileTeaPartyRepository implements TeaPartyRepository {
  async insert(newTeaParty: TeaParty): Promise<void> {
    const newTeaPartyDto = newTeaParty.toDto();

    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(
      path.join(DIR, new Date(newTeaPartyDto.eventDate).getTime() + '.json'),
      JSON.stringify(newTeaPartyDto),
      {
        flag: 'wx', // 既に存在する場合はエラー
      }
    );
  }

  async findOneByEventDate(eventDate: EventDate): Promise<TeaParty | null> {
    const fileName = new Date(eventDate.eventDate).getTime() + '.json';
    const filePath = path.join(DIR, fileName);

    const data = await (async () => {
      try {
        return (await fs.readFile(filePath)).toString();
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      }
    })();

    return data ? TeaParty.reconstruct(JSON.parse(data)) : null;
  }
}
