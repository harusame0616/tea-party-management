import { ParameterError } from '../../../../../errors/parameter-error';
import { GroupCountDivideSterategy } from '../../../../../hooks/member/divide-sterategy/group-count-divide-sterategy';

const members = [
  'member1',
  'member2',
  'member3',
  'member4',
  'member5',
  'member6',
  'member7',
  'member8',
  'member9',
].map((member) => ({ memberId: member, name: member }));

describe('正常系', () => {
  it.each([[1, 9, 10]])('指定したグループ数に分けられる', (groupCount) => {
    const divideSterategy = new GroupCountDivideSterategy();

    const groups = divideSterategy.divide(members, groupCount);
    expect(groups.length).toBe(groupCount);
  });

  it.each([
    [1, [9]],
    [2, [5, 4]],
    [3, [3, 3, 3]],
    [4, [3, 2, 2, 2]],
    [10, [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]],
  ])(
    'グループごとの人数が正しく振り分けられている',
    (groupCount, expectGroupLengthList) => {
      const divideSterategy = new GroupCountDivideSterategy();

      const groups = divideSterategy.divide(members, groupCount);
      const groupLengthList = groups.map((group) => group.members.length);
      groupLengthList.forEach((groupLength, index) => {
        expect(groupLength).toBe(expectGroupLengthList[index]);
      });
    }
  );

  it('全てのメンバーが重複なく振り分けられている', () => {
    const divideSterategy = new GroupCountDivideSterategy();

    const groups = divideSterategy.divide(members, 1);

    const dividedMembers = Array.from(
      new Set(
        groups.flatMap((group) => group.members.map(({ memberId }) => memberId))
      )
    );
    expect(dividedMembers.length).toBe(members.length);
  });
});

describe('異常系', () => {
  it.each([[0, -1]])('グループ数が0以下', (groupCount) => {
    const divideSterategy = new GroupCountDivideSterategy();

    expect(() => divideSterategy.divide(members, groupCount)).toThrow(
      new ParameterError('グループ数は1以上で指定してください。')
    );
  });
});
