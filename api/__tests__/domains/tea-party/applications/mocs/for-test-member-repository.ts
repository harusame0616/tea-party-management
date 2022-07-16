import { MemberRepository } from '@/domains/member/applications/member-repository';
import { Member } from 'domains/member/models/member';

export class ForTestMemberRepository implements MemberRepository {
  constructor(public members: Member[]) {}
  async listAll(): Promise<Member[]> {
    return this.members;
  }

  async findOneByChatId(chatId: string): Promise<Member | null> {
    return this.members.find((member) => member.chatId === chatId) ?? null;
  }
}
