import { Member } from '@/domains/member/models/member';
import { TeaPartyCreateUsecase } from '@/domains/tea-party/applications/tea-party-create-usecase';
import { ConflictError } from '@/errors/conflict-error';
import { ParameterError } from '@/errors/parameter-error';
import { ForTestTeaPartyRepository } from './mocs/for-test-tea-party-repository';
import { ForTestMemberRepository } from './mocs/for-test-member-repository';
import { ForTestTeaPartyNotificationGateway } from './mocs/for-test-tea-party-notification-gateway';

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

  it.each(['2022-01-10', '2022-01-20', '2022-01-30', '2022-12-10'])(
    '作成できる',
    async () => {
      const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
        teaPartyRepository,
        memberRepository,
        teaPartyNotificationGateway
      );

      const eventDate = '2022-02-20';
      await teaPartyCreateUsecase.execute({ eventDate });

      expect(teaPartyRepository.teaParties[0]).toEqual({
        teaPartyId: expect.anything(),
        eventDate: new Date(eventDate).toUTCString(),
        groups: [], // 作成時はグループなし
        attendances: expect.arrayContaining(
          members.map((member) => ({
            memberId: member.memberId.memberId,
            status: 'attendance', // 作成時は全員「参加」状態であること
          }))
        ),
      });
    }
  );
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

  it.each([
    '',
    '2022-1-10',
    '2022-01-1',
    '22-01-10',
    'a2222-01-10',
    '2222-a1-10',
    '2222-01-10a',
  ])('開催日フォーマットが異常', async (eventDate) => {
    const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
      teaPartyRepository,
      memberRepository,
      teaPartyNotificationGateway
    );

    await expect(teaPartyCreateUsecase.execute({ eventDate })).rejects.toThrow(
      new ParameterError('開催日のフォーマットが異常です。')
    );
  });

  it.each(['2022-00-10', '2022-13-00'])('開催月が異常', async (eventDate) => {
    const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
      teaPartyRepository,
      memberRepository,
      teaPartyNotificationGateway
    );

    await expect(teaPartyCreateUsecase.execute({ eventDate })).rejects.toThrow(
      new ParameterError('開催月が異常です。')
    );
  });

  it.each(['2022-01-00', '2022-01-01', '2022-02-30'])(
    '開催日が異常',
    async (eventDate) => {
      const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
        teaPartyRepository,
        memberRepository,
        teaPartyNotificationGateway
      );

      await expect(
        teaPartyCreateUsecase.execute({ eventDate })
      ).rejects.toThrow(new ParameterError('開催日が異常です。'));
    }
  );

  it('作成済みの開催日のお茶会', async () => {
    const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
      teaPartyRepository,
      memberRepository,
      teaPartyNotificationGateway
    );

    await teaPartyCreateUsecase.execute({ eventDate: '2022-02-20' });
    await expect(
      teaPartyCreateUsecase.execute({ eventDate: '2022-02-20' })
    ).rejects.toThrow(new ConflictError('指定日のお茶会は作成済みです。'));
  });
});
