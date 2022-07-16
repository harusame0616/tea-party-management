import { Member } from '../../hooks/member/useMemberDivide';
import ItemBase from '../base/item-base';

interface MemberItemProp {
  member: Member;
}

const MemberItem = (prop: MemberItemProp) => {
  return <ItemBase>{prop.member.name}</ItemBase>;
};

export default MemberItem;
