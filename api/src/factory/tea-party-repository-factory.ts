import { TeaPartyRepository } from '@/domains/tea-party/applications/tea-party-repository';
import { GcsTeaPartyRepository } from '../domains/tea-party/infrastructures/tea-party-repository/gcs-tea-party-repository';

export class TeaPartyRepositoryFactory {
  private static repository: TeaPartyRepository;

  static getInstance(): TeaPartyRepository {
    if (!this.repository) {
      this.repository = new GcsTeaPartyRepository({
        bucketName: 'tea-party-datastore',
        keyFilename: process.env.GCP_KEY_FILENAME,
      });
    }

    return this.repository;
  }
}
