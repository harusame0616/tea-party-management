import { MemberQuery } from '@/domains/member/applications/member-query';
import { GcsMemberQuery } from '@/domains/member/infrastructures/gcs-member-query';

export class MemberQueryFactory {
  private static query: MemberQuery;

  static getInstance(): MemberQuery {
    if (!this.query) {
      this.query = new GcsMemberQuery({
        bucketName: 'tea-party-datastore',
        keyFilename: process.env.GCP_KEY_FILENAME,
      });
    }

    return this.query;
  }
}
