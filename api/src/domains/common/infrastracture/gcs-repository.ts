import { Bucket, Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import { uuidv7 } from 'uuidv7';
import path from 'path';
import { ConflictError } from '@/errors/conflict-error';

interface GcsRepositoryParam {
  bucketName: string;
  keyFilename?: string;
}

interface SaveOption {
  checkExists: boolean;
}
export abstract class GcsRepository {
  protected bucket: Bucket;

  constructor(protected param: GcsRepositoryParam) {
    this.bucket = new Storage(
      this.param.keyFilename
        ? { keyFilename: this.param.keyFilename }
        : undefined
    ).bucket(param.bucketName);
  }

  protected async save(to: string, data: string, saveOption?: SaveOption) {
    const temporaryPath = this.generateTemporaryPath();

    await fs.writeFile(temporaryPath, data, {
      flag: 'w',
    });

    try {
      const destination = path.join(this.basePath, to);

      if (saveOption?.checkExists) {
        const [exists] = await this.bucket.file(destination).exists();
        if (exists) {
          throw new ConflictError('作成済みです。');
        }
      }
      await this.bucket.upload(temporaryPath, { destination });
    } finally {
      await fs.unlink(temporaryPath);
    }
  }

  async load(from: string): Promise<string | null> {
    const temporaryPath = this.generateTemporaryPath();

    try {
      await this.bucket
        .file(path.join(this.basePath, from))
        .download({ destination: temporaryPath });
    } catch (err: any) {
      if (err.code == 404) {
        return null;
      }

      throw err;
    }

    const data = (await fs.readFile(temporaryPath)).toString();
    await fs.unlink(temporaryPath);
    return data;
  }

  generateTemporaryPath() {
    return path.join('/tmp', uuidv7());
  }

  abstract get basePath(): string;
}
