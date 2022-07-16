interface MemberDto {
  memberId: string;
  name: string;
  chatId: string;
}

export interface MemberQuery {
  listAll(): Promise<MemberDto[]>;
}
