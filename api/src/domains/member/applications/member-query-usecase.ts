import { MemberQuery } from './member-query';

interface MemberListAllQueryUsecaseParam {
  memberQuery: MemberQuery;
}

export class MemberListAllQueryUsecase {
  constructor(private param: MemberListAllQueryUsecaseParam) {}

  async execute() {
    return await this.param.memberQuery.listAll();
  }
}
