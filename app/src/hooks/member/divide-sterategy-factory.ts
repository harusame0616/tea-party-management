import { ParameterError } from "../../errors/parameter-error";
import { GroupCountDivideSterategy } from "./divide-sterategy/group-count-divide-sterategy";
import { PersonCountPerGroupsDivideSterategy } from "./divide-sterategy/person-count-per-groups-divide-sterategy";
import { DivideSterategy, Member } from "./useMemberDivide";

export const sterategies = ["groupCount", "personCountPerGroups"] as const;
export type Sterategy = typeof sterategies[number];
export const isSterategy = (v: any): v is Sterategy => sterategies.includes(v);
export interface CreateParam {
  sterategy: Sterategy;
}

export class DivideSterategyFactory {
  static create(param: CreateParam): DivideSterategy {
    if (param.sterategy === "groupCount") {
      return new GroupCountDivideSterategy();
    } else if (param.sterategy === "personCountPerGroups") {
      return new PersonCountPerGroupsDivideSterategy();
    }

    throw new ParameterError("分割方法の指定が異常です。");
  }
}
