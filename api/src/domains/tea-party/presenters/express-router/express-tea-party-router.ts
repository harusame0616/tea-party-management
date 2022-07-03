import { MemberRepositoryFactory } from '@/factory/member-repository-factory';
import { TeaPartyNotificationGatewayFactory } from '@/factory/tea-party-notification-gateway-factory';
import { requestWrapper } from '@/utils/presenter/request-handler';
import { ParameterError } from '@/errors/parameter-error';
import Express from 'express';
import { TeaPartyRepositoryFactory } from '../../../../factory/tea-party-repository-factory';
import { TeaPartyAbsenceUsecase } from '../../applications/tea-party-absence-usecase';
import { TeaPartyCreateUsecase } from '../../applications/tea-party-create-usecase';
import { TeaPartyAttendanceUsecase } from '../../applications/tea-party-attendance-usecase';

export const router = Express.Router();

router.post(
  '/',
  requestWrapper(async (req) => {
    const { eventDate } = req.body;

    if (typeof eventDate !== 'string') {
      throw new ParameterError('パラメーターが不正です');
    }

    if (!process.env.INCOMMING_WEB_HOOK) {
      throw new Error('Slack用の環境変数が未設定です。');
    }

    const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
      TeaPartyRepositoryFactory.getInstance(),
      MemberRepositoryFactory.getInstance(),
      TeaPartyNotificationGatewayFactory.getInstance()
    );

    await teaPartyCreateUsecase.execute({ eventDate });
  })
);

router.put(
  '/attendance',
  requestWrapper(async (req) => {
    const { eventDate, chatId, attendance } = req.body;

    if (
      typeof eventDate !== 'string' ||
      typeof chatId !== 'string' ||
      !['absence', 'attendance'].includes(attendance)
    ) {
      throw new ParameterError('パラメーターが不正です');
    }

    const teapartyAttendanceChangeUsecase = (() => {
      const teaPartyRepository = TeaPartyRepositoryFactory.getInstance();
      const memberRepository = MemberRepositoryFactory.getInstance();

      if (attendance === 'absence') {
        return new TeaPartyAbsenceUsecase({
          teaPartyRepository,
          memberRepository,
        });
      } else if (attendance === 'attendance') {
        return new TeaPartyAttendanceUsecase({
          teaPartyRepository,
          memberRepository,
        });
      } else {
        throw new Error('never route: attendance condition');
      }
    })();

    await teapartyAttendanceChangeUsecase.execute({ eventDate, chatId });
  })
);
