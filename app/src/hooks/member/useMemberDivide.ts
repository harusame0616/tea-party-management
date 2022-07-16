import { useState } from "react";

export interface DivideSterategy {
  divide(members: Member[], divideCount: number): Group[];
}

export interface Member {
  memberId: string;
  name: string;
}

export interface Group {
  members: Member[];
}

const fisherYatesShuffle = <T>(source: T[]) => {
  const shuffled = [...source];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = swap;
  }

  return shuffled;
};

const useMemberDivide = (divideSterategy: DivideSterategy) => {
  const [members, setMembers] = useState<Member[]>([]);

  const shuffleMember = (members: Member[]) => {
    return fisherYatesShuffle(members);
  };

  const divide = (divideCount: number) => {
    return divideSterategy.divide(shuffleMember(members), divideCount);
  };

  return { divide, members, setMembers };
};

export default useMemberDivide;
