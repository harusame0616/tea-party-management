import { Member, MemberDto } from '@/domains/member/models/member';
import { TeaPartyAttendanceUsecase } from '@/domains/tea-party/applications/tea-party-attendance-usecase';
import { AttendanceDto } from '@/domains/tea-party/models/attendance';
import { NotFoundError } from '@/errors/not-found-error';
import { ForTestMemberRepository } from './mocs/for-test-member-repository';
import { ForTestTeaPartyRepository } from './mocs/for-test-tea-party-repository';

let teaPartyRepository: ForTestTeaPartyRepository;
let memberRepository: ForTestMemberRepository;
let attendanceUsecase: TeaPartyAttendanceUsecase;
const initializeRepository = () => {
  teaPartyRepository = new ForTestTeaPartyRepository([
    {
      teaPartyId: '01819bf3-9ecc-7879-a400-703be75ea939',
      attendances: [
        { memberId: '000001', status: 'attendance' },
        { memberId: '000002', status: 'attendance' },
        { memberId: '000003', status: 'attendance' },
        { memberId: '000004', status: 'attendance' },
      ],
      eventDate: 'Wed, 20 Jul 2022 00:00:00 GMT',
      groups: [],
    },
    {
      teaPartyId: '01819bf3-9ecc-7879-a400-703be75ea339',
      attendances: [
        { memberId: '000001', status: 'attendance' },
        { memberId: '000002', status: 'attendance' },
        { memberId: '000004', status: 'attendance' },
        { memberId: '000003', status: 'attendance' },
      ],
      eventDate: 'Wed, 10 Jul 2022 00:00:00 GMT',
      groups: [],
    },
  ]);

  memberRepository = new ForTestMemberRepository(
    [
      {
        memberId: '000001',
        name: '名前1',
        chatId: 'chatId1',
      },
      {
        memberId: '000002',
        name: '名前2',
        chatId: 'chatId2',
      },
      {
        memberId: '000003',
        name: '名前3',
        chatId: 'chatId3',
      },
      {
        memberId: '000004',
        name: '名前4',
        chatId: 'chatId4',
      },
    ].map((memberDto) => Member.reconstruct(memberDto as MemberDto))
  );
  attendanceUsecase = new TeaPartyAttendanceUsecase({
    teaPartyRepository,
    memberRepository,
  });
};
const memberId = '000001';
const chatId = 'chatId1';
const eventDate = '2022-07-20';

describe('正常系', () => {
  beforeEach(initializeRepository);

  it('出席にできる', async () => {
    await attendanceUsecase.execute({
      eventDate,
      chatId,
    });

    const teaParty = teaPartyRepository.teaParties.find(
      (teaParty) =>
        new Date(teaParty.eventDate).getTime() === new Date(eventDate).getTime()
    );

    if (!teaParty) {
      throw new Error('');
    }

    const attendance = teaParty.attendances.find(
      (attendance) => attendance.memberId === memberId
    );

    expect(attendance).toEqual<AttendanceDto>({
      memberId,
      status: 'attendance',
    });
  });

  it('既に出席済みのメンバーを再度出席にする。', async () => {
    const memberId = '000001';
    await attendanceUsecase.execute({
      eventDate: '2022-07-20',
      chatId,
    });
    await attendanceUsecase.execute({
      eventDate: '2022-07-20',
      chatId,
    });

    const teaParty = teaPartyRepository.teaParties.find(
      (teaParty) =>
        new Date(teaParty.eventDate).getTime() ===
        new Date('2022-07-20').getTime()
    );

    if (!teaParty) {
      throw new Error('');
    }

    const attendance = teaParty.attendances.find(
      (attendance) => attendance.memberId === memberId
    );

    expect(attendance).toEqual<AttendanceDto>({
      memberId,
      status: 'attendance',
    });
  });
});

describe('異常系', () => {
  beforeEach(initializeRepository);

  it('開催日にお茶会が存在しない', async () => {
    await expect(
      attendanceUsecase.execute({
        eventDate: '2000-07-10',
        chatId,
      })
    ).rejects.toThrow(new NotFoundError('お茶会'));
  });

  it('未登録のメンバーID', async () => {
    await expect(
      attendanceUsecase.execute({
        eventDate,
        chatId: '000014',
      })
    ).rejects.toThrow(new NotFoundError('メンバー'));
  });
});
