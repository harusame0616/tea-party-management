import { TeaPartyQuery } from '@/domains/tea-party/applications/tea-party-query';
import { GcsTeaPartyQuery } from '@/domains/tea-party/infrastructures/tea-party-query/gcs-tea-party-query';

export class TeaPartyQueryFactory {
  private static query: TeaPartyQuery;

  static getInstance(): TeaPartyQuery {
    if (!this.query) {
      this.query = new GcsTeaPartyQuery({
        bucketName: 'tea-party-datastore',
        keyFilename: process.env.GCP_KEY_FILENAME,
      });
    }

    return this.query;
  }
}
