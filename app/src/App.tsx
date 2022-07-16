import {
  AppBar,
  Button,
  CssBaseline,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import './App.css';
import GroupCard from './components/domains/group-card';
import MemberDivideSettingCard from './components/domains/member-divide-card';
import { Group, Member } from './hooks/member/useMemberDivide';
import useMembers from './hooks/member/useMembers';
import useTeaParty from './hooks/teaparty/useTeaParty';
import useTeaPartyEventDateList from './hooks/teaparty/useTeaPartyEventDateList';
import { api } from './library/api';

function App() {
  const [selectedEventDate, setSelectedEventDate] = useState('');
  const [attendanceMembers, setAttendanceMembers] = useState<Member[]>([]);
  const [absenceMembers, setAbsenceMembers] = useState<Member[]>([]);

  const [groups, setGroups] = useState<Group[]>([]);

  const teaPartyEventDateList = useTeaPartyEventDateList();
  const members = useMembers();
  const teaParty = useTeaParty(selectedEventDate);

  useEffect(() => {
    if (!teaParty.teaParty) {
      return;
    }

    setAttendanceMembers(
      teaParty.teaParty.attendances
        .filter((attendance: any) => attendance.status === 'attendance')
        .map((attendance: any) => members.memberIdMap[attendance.memberId])
    );
    setAbsenceMembers(
      teaParty.teaParty.attendances
        .filter((attendance: any) => attendance.status === 'absence')
        .map((attendance: any) => members.memberIdMap[attendance.memberId])
    );
    setGroups(
      teaParty.teaParty.groups.map((group: any) => ({
        members: group.memberIds.map(
          (memberId: string) => members.memberIdMap[memberId]
        ),
      }))
    );
  }, [teaParty.teaParty]);

  useEffect(() => {
    if (selectedEventDate !== '' || teaPartyEventDateList.isLoading) {
      return;
    }

    const mostRecentEventDate = teaPartyEventDateList?.eventDateList?.at(-1);
    if (mostRecentEventDate) {
      setSelectedEventDate(mostRecentEventDate);
    }
  }, [teaPartyEventDateList]);

  const divideHandler = (groups: Group[]) => {
    setGroups(groups);
  };

  const send = async (groups: any) => {
    await api.put('teaparty/groups/', {
      eventDate: selectedEventDate,
      groups: groups.map((group: any) => ({
        memberIds: group.members.map((member: any) => member.memberId),
      })),
    });
  };

  return (
    <Box
      className="App"
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <CssBaseline />
      <AppBar sx={{ bgcolor: 'white' }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="20px"
        >
          <Select
            size="small"
            label="開催日"
            value={selectedEventDate}
            onChange={(e) => setSelectedEventDate(e.target.value)}
          >
            {teaPartyEventDateList.isLoading ? (
              <MenuItem value="">now loading</MenuItem>
            ) : (
              teaPartyEventDateList?.eventDateList?.map((eventDate: any) => (
                <MenuItem key={eventDate} value={eventDate}>
                  {eventDate}
                </MenuItem>
              ))
            )}
          </Select>
          <Button
            variant="contained"
            onClick={() => send(groups)}
            color="primary"
          >
            送信
          </Button>
        </Box>
      </AppBar>
      <Box
        sx={{
          flexGrow: '1',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Grid container justifyContent="center" marginTop="100px">
          <Grid item xs={11} md={10} lg={8}>
            <Box marginBottom="20px">
              <MemberDivideSettingCard
                members={attendanceMembers}
                divide={divideHandler}
              />
            </Box>
            <Box>
              <Grid container spacing={2} marginBottom="20px">
                {[
                  [attendanceMembers, '出席メンバー'],
                  [absenceMembers, '欠席メンバー'],
                ].map(([_members, label], i) => (
                  <Grid item xs={6} key={i}>
                    <GroupCard
                      label={label as string}
                      group={{ members: _members as Member[] }}
                      isLoading={teaParty.isLoading || members.isLoading}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={2}>
                {teaParty.isLoading
                  ? null
                  : groups.map((group, i) => (
                      <Grid item xs={12} sm={6} md={3} lg={2} key={i}>
                        <GroupCard group={group} />
                      </Grid>
                    ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
