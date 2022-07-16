import { Group } from '../../hooks/member/useMemberDivide';
import CardBase from '../base/card-base';
import MemberItem from './member-item';

interface GroupCardProp {
  group: Group;
  label?: string;
  isLoading?: boolean;
}

const GroupCard = (prop: GroupCardProp) => {
  return (
    <CardBase title={prop.label}>
      {prop.isLoading ? (
        <div>now loading{JSON.stringify(prop.isLoading)}</div>
      ) : (
        prop.group.members.map((member) => (
          <MemberItem member={member} key={member.memberId} />
        ))
      )}
    </CardBase>
  );
};

export default GroupCard;
