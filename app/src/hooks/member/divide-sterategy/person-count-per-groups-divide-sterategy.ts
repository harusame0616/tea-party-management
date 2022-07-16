import { ParameterError } from "../../../errors/parameter-error";
import { DivideSterategy, Group, Member } from "../useMemberDivide";

export class PersonCountPerGroupsDivideSterategy implements DivideSterategy {
  divide(members: Member[], personCountPerGroups: number) {
    if (personCountPerGroups <= 0) {
      throw new ParameterError(
        "グループあたりの人数は1以上で指定してください。"
      );
    }
    const groups: Group[] = new Array(
      Math.ceil(members.length / personCountPerGroups)
    )
      .fill(null)
      .map(() => ({ members: [] }));
    members.forEach((member: Member, index) => {
      groups[index % groups.length].members.push(member);
    });

    return groups;
  }
}
