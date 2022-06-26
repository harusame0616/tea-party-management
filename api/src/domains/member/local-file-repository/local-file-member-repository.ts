import { MemberRepository } from 'domains/member/member-repository';
import { Member, MemberDto } from 'domains/member/models/member';
import fs from 'fs/promises';
import path from 'path';

export class LocalFileMemberRepository implements MemberRepository {
  static DIR = path.join('.store', 'member');
  static FILE = path.join(LocalFileMemberRepository.DIR, 'member.json');

  async listAll(): Promise<Member[]> {
    const data = await (async () => {
      try {
        return (await fs.readFile(LocalFileMemberRepository.FILE))?.toString();
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      }
    })();

    const member = data ? JSON.parse(data) : {};
    return member?.members?.map((memberDto: MemberDto) =>
      Member.reconstruct(memberDto)
    );
  }

  async findOneByChatId(chatId: string): Promise<Member | null> {
    const data = await (async () => {
      try {
        return (await fs.readFile(LocalFileMemberRepository.FILE))?.toString();
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      }
    })();

    const member = data ? JSON.parse(data) : { members: [] };
    const memberDtoOfChatId = member.members?.find(
      (memberDto: MemberDto) => memberDto.chatId === chatId
    );

    return memberDtoOfChatId ? Member.reconstruct(memberDtoOfChatId) : null;
  }
}
