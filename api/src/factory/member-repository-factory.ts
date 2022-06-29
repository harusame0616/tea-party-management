import { GcsMemberRepository } from '@/domains/member/infrastructures/gcs-member-repository';
import { MemberRepository } from '@/domains/member/member-repository';

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
