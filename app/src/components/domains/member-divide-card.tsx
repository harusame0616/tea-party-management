import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  DivideSterategyFactory,
  isSterategy,
  sterategies,
  Sterategy,
} from '../../hooks/member/divide-sterategy-factory';
import useMemberDivide, {
  Group,
  Member,
} from '../../hooks/member/useMemberDivide';
import CardBase from '../base/card-base';

interface MemberDivideSettingCardProps {
  divide: (group: Group[]) => void | Promise<void>;
  members: Member[];
}

const MemberDivideSettingCard = (prop: MemberDivideSettingCardProps) => {
  const [divideCount, setDivideNumber] = useState(1);
  const [divideMethod, setDivideMethod] = useState<Sterategy>(sterategies[0]);

  const memberDivide = useMemberDivide(
    DivideSterategyFactory.create({
      sterategy: divideMethod,
    })
  );

  const sterategyLabelMap: {
    [key in Sterategy]: string;
  } = {
    groupCount: 'グループ数',
    personCountPerGroups: 'グループあたりの人数',
  };

  useEffect(() => {
    memberDivide.setMembers(prop.members);
  }, [prop.members]);

  return (
    <CardBase>
      <RadioGroup
        onChange={(e) => {
          if (!isSterategy(e.target.value)) {
            throw new Error('分割方法の値が異常です');
          }
          setDivideMethod(e.target.value);
        }}
      >
        {Object.entries(sterategyLabelMap).map(([sterategy, label]) => (
          <FormControlLabel
            key={sterategy}
            value={sterategy}
            control={<Radio />}
            label={label}
            checked={divideMethod === sterategy}
          />
        ))}
      </RadioGroup>
      <Box display="flex" alignItems="flex-end" flexWrap="wrap">
        <TextField
          label={sterategyLabelMap[divideMethod]}
          type="number"
          value={divideCount}
          onChange={(e) => setDivideNumber(parseInt(e.target.value))}
          variant="standard"
        />
        <Button
          variant="contained"
          onClick={() => prop.divide(memberDivide.divide(divideCount))}
          color="primary"
        >
          振り分け
        </Button>
      </Box>
    </CardBase>
  );
};

export default MemberDivideSettingCard;
