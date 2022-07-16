import { GcsRepository } from '@/domains/common/infrastracture/gcs-repository';
import { MemberRepository } from '../applications/member-repository';
import { Member, MemberDto } from '../models/member';

export class GcsMemberRepository
  extends GcsRepository
  implements MemberRepository
{
  get basePath(): string {
    return 'member';
  }

  async listAll(): Promise<Member[]> {
    const data = await this.load('member.json');
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.members)) {
      return [];
    }
    return parsed.members.map((memberDto: MemberDto) =>
      Member.reconstruct(memberDto)
    );
  }

  async findOneByChatId(chatId: string): Promise<Member | null> {
    const data = await this.load('member.json');
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.members)) {
      return null;
    }

    const memberDtoOfChatId = parsed.members.find(
      (memberDto: MemberDto) => memberDto.chatId === chatId
    );

    return memberDtoOfChatId ? Member.reconstruct(memberDtoOfChatId) : null;
  }
}
