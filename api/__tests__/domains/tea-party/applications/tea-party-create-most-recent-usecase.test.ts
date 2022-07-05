import { Member } from '@/domains/member/models/member';
import { TeaPartyCreateMostRecentUsecase } from '@/domains/tea-party/applications/tea-party-create-most-recent-usecase';
import { ConflictError } from '@/errors/conflict-error';
import { NotFoundError } from '@/errors/not-found-error';
import { ForTestMemberRepository } from './mocs/for-test-member-repository';
import { ForTestTeaPartyNotificationGateway } from './mocs/for-test-tea-party-notification-gateway';
import { ForTestTeaPartyRepository } from './mocs/for-test-tea-party-repository';

const memberList = [
  ['斉藤ゆかり', 'chatId01'],
  ['緒方健二', 'chatId02'],
  ['山田浩一', 'chatId03'],
];

// ********************  正常系テストケース  ********************
describe('正常系', () => {
  const members = memberList.map(([name, chatId]) =>
    Member.create({ name, chatId })
  );

  let teaPartyRepository: ForTestTeaPartyRepository;
  let memberRepository: ForTestMemberRepository;
  let teaPartyNotificationGateway: ForTestTeaPartyNotificationGateway;
  beforeEach(() => {
    teaPartyRepository = new ForTestTeaPartyRepository();
    memberRepository = new ForTestMemberRepository(members);
    teaPartyNotificationGateway = new ForTestTeaPartyNotificationGateway();
  });

  it('作成できる', async () => {
    const teaPartyCreateUsecase = new TeaPartyCreateMostRecentUsecase(
      teaPartyRepository,
      memberRepository,
      teaPartyNotificationGateway
    );

    await teaPartyCreateUsecase.execute({ today: new Date('2022-02-07') });

    expect(teaPartyRepository.teaParties[0]).toEqual({
      teaPartyId: expect.anything(),
      eventDate: new Date('2022-02-10').toUTCString(),
      groups: [], // 作成時はグループなし
      attendances: expect.arrayContaining(
        members.map((member) => ({
          memberId: member.memberId.memberId,
          status: 'attendance', // 作成時は全員「参加」状態であること
        }))
      ),
    });
  });
});

// ********************  異常系テストケース  ********************
describe('異常系', () => {
  const members = memberList.map(([name, chatId]) =>
    Member.create({ name, chatId })
  );

  let teaPartyRepository: ForTestTeaPartyRepository;
  let memberRepository: ForTestMemberRepository;
  let teaPartyNotificationGateway: ForTestTeaPartyNotificationGateway;
  beforeEach(() => {
    teaPartyRepository = new ForTestTeaPartyRepository();
    memberRepository = new ForTestMemberRepository(members);
    teaPartyNotificationGateway = new ForTestTeaPartyNotificationGateway();
  });

  it('開催日まで7日を超えている', async () => {
    const teaPartyCreateUsecase = new TeaPartyCreateMostRecentUsecase(
      teaPartyRepository,
      memberRepository,
      teaPartyNotificationGateway
    );

    await expect(
      teaPartyCreateUsecase.execute({ today: new Date('2022-01-01') })
    ).rejects.toThrow(new NotFoundError('作成可能な直近のお茶会'));
  });

  it('作成済みの開催日のお茶会', async () => {
    const teaPartyCreateUsecase = new TeaPartyCreateMostRecentUsecase(
      teaPartyRepository,
      memberRepository,
      teaPartyNotificationGateway
    );

    await teaPartyCreateUsecase.execute({ today: new Date('2022-01-17') });
    await expect(
      teaPartyCreateUsecase.execute({ today: new Date('2022-01-18') })
    ).rejects.toThrow(new ConflictError('お茶会は作成済みです。'));
  });
});
