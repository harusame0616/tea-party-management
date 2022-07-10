import { MemberRepository } from '@/domains/member/applications/member-repository';
import { GcsMemberRepository } from '@/domains/member/infrastructures/gcs-member-repository';

export class MemberRepositoryFactory {
  private static repository: MemberRepository;

  static getInstance(): MemberRepository {
    if (!this.repository) {
      this.repository = new GcsMemberRepository({
        bucketName: 'tea-party-datastore',
        keyFilename: process.env.GCP_KEY_FILENAME,
      });
    }

    return MemberRepositoryFactory.repository;
  }
}
