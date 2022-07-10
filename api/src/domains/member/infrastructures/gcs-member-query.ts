import { Bucket, Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';
import { uuidv7 } from 'uuidv7';
import { MemberQuery } from '../applications/member-query';
import { MemberDto } from '../models/member';

interface GcsQueryParam {
  bucketName: string;
  keyFilename?: string;
}

export class GcsMemberQuery implements MemberQuery {
  protected bucket: Bucket;

  get basePath(): string {
    return 'member';
  }

  constructor(protected param: GcsQueryParam) {
    this.bucket = new Storage(
      this.param.keyFilename
        ? { keyFilename: this.param.keyFilename }
        : undefined
    ).bucket(param.bucketName);
  }

  async listAll(): Promise<MemberDto[]> {
    const temporaryPath = path.join('/tmp', uuidv7());

    try {
      await this.bucket
        .file(path.join(this.basePath, 'member.json'))
        .download({ destination: temporaryPath });
    } catch (err: any) {
      if (err.code == 404) {
        return [];
      }

      throw err;
    }

    const data = (await fs.readFile(temporaryPath)).toString();
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.members)) {
      return [];
    }

    return parsed.members;
  }
}
