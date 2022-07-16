import { Bucket, Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';
import { uuidv7 } from 'uuidv7';
import {
  TeaPartyDetailDto,
  TeaPartyQuery,
} from '../../applications/tea-party-query';
import { EventDate } from '../../models/event-date';

interface GcsRepositoryParam {
  bucketName: string;
  keyFilename?: string;
}

export class GcsTeaPartyQuery implements TeaPartyQuery {
  protected bucket: Bucket;

  get basePath() {
    return 'tea-party';
  }

  constructor(protected param: GcsRepositoryParam) {
    this.bucket = new Storage(
      this.param.keyFilename
        ? { keyFilename: this.param.keyFilename }
        : undefined
    ).bucket(param.bucketName);
  }

  async listEventDate(): Promise<Date[]> {
    const [files] = await this.bucket.getFiles({ prefix: this.basePath });
    return files
      .map((file) => parseInt(path.basename(file.name, '.json')))
      .sort((a, b) => a - b)
      .map((unixtime) => new Date(unixtime));
  }

  async teaPartyDetailByEventDate(
    eventDate: EventDate
  ): Promise<TeaPartyDetailDto | null> {
    const temporaryPath = path.join('/tmp', uuidv7());

    try {
      await this.bucket
        .file(
          path.join(
            this.basePath,
            new Date(eventDate.eventDate).getTime() + '.json'
          )
        )
        .download({ destination: temporaryPath });
    } catch (err: any) {
      if (err.code == 404) {
        return null;
      }

      throw err;
    }

    const data = (await fs.readFile(temporaryPath)).toString();
    await fs.unlink(temporaryPath);
    return JSON.parse(data);
  }
}
