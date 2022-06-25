import { TeaParty, TeaPartyCreateParam } from '../models/tea-party';
import { MemberRepository } from '../../member/member-repository';

export type TeaPartyCreateServiceParam = Omit<
  TeaPartyCreateParam,
  'memberIdList'
>;

export class TeaPartyCreateService {
  constructor(private memberRepository: MemberRepository) {}

  async create(param: TeaPartyCreateServiceParam) {
    const members = await this.memberRepository.listAll();

    // お茶会作成時は全てのメンバーがお茶会メンバーに含まれている
    const teaParty = TeaParty.create({
      ...param,
      memberIdList: members.map((member) => member.memberId),
    });

    return teaParty;
  }
}
