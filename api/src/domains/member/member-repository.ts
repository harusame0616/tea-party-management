import { Member } from './models/member';

export interface MemberRepository {
  listAll(): Promise<Member[]>;
}
