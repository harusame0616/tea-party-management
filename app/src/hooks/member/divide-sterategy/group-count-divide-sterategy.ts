import { ParameterError } from "../../../errors/parameter-error";
import { DivideSterategy, Group, Member } from "../useMemberDivide";

export class GroupCountDivideSterategy implements DivideSterategy {
  divide(members: Member[], groupCount: number) {
    if (groupCount <= 0) {
      throw new ParameterError("グループ数は1以上で指定してください。");
    }

    const groups: Group[] = new Array(groupCount)
      .fill(null)
      .map(() => ({ members: [] }));

    members.forEach((member: Member, index) => {
      groups[index % groups.length].members.push(member);
    });

    return groups;
  }
}
