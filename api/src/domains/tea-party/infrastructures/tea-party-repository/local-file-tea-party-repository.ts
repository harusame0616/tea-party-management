import { OpenMode } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { TeaPartyRepository } from '../../applications/tea-party-repository';
import { EventDate } from '../../models/event-date';
import { TeaParty } from '../../models/tea-party';

const DIR = path.join('.store', 'tea-party');
export class LocalFileTeaPartyRepository implements TeaPartyRepository {
  private static async writeTeaParty(teaParty: TeaParty, flag: OpenMode) {
    const teaPartyDto = teaParty.toDto();

    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(
      path.join(DIR, new Date(teaPartyDto.eventDate).getTime() + '.json'),
      JSON.stringify(teaPartyDto),
      { flag }
    );

    return path.join(DIR, new Date(teaPartyDto.eventDate).getTime() + '.json');
  }

  async insert(newTeaParty: TeaParty): Promise<void> {
    await LocalFileTeaPartyRepository.writeTeaParty(newTeaParty, 'wx');
  }

  async update(teaParty: TeaParty): Promise<void> {
    await LocalFileTeaPartyRepository.writeTeaParty(teaParty, 'w');
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
