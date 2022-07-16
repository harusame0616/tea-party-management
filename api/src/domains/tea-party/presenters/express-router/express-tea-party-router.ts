import { MemberRepositoryFactory } from '@/factory/member-repository-factory';
import { TeaPartyNotificationGatewayFactory } from '@/factory/tea-party-notification-gateway-factory';
import { requestWrapper } from '@/utils/presenter/request-handler';
import { ParameterError } from '@/errors/parameter-error';
import Express from 'express';
import { TeaPartyRepositoryFactory } from '../../../../factory/tea-party-repository-factory';
import { TeaPartyAbsenceUsecase } from '../../applications/tea-party-absence-usecase';
import { TeaPartyCreateUsecase } from '../../applications/tea-party-create-usecase';
import { TeaPartyAttendanceUsecase } from '../../applications/tea-party-attendance-usecase';
import { TeaPartyCreateMostRecentUsecase } from '../../applications/tea-party-create-most-recent-usecase';
import { TeaPartyDetailQuery } from '../../applications/tea-party-detail-query';
import { TeaPartyQueryFactory } from '@/factory/tea-party-query-factory';
import { TeaPartyListEventDateQueryUsecase } from '../../applications/tea-party-list-event-date-query-usecase';
import { TeaPartyGroupSaveUsecase } from '../../applications/tea-party-group-save-usecase';

export const router = Express.Router();

router.get(
  '/',
  requestWrapper(async (req) => {
    const { eventDate } = req.query;

    if (typeof eventDate !== 'string') {
      throw new ParameterError('パラメーターが不正です');
    }

    const query = new TeaPartyDetailQuery({
      teaPartyQuery: TeaPartyQueryFactory.getInstance(),
    });

    return await query.execute(eventDate);
  })
);

router.get(
  '/event_dates',
  requestWrapper(async () => {
    const query = new TeaPartyListEventDateQueryUsecase({
      teaPartyQuery: TeaPartyQueryFactory.getInstance(),
    });

    return await query.execute();
  })
);

router.post(
  '/',
  requestWrapper(async (req) => {
    const { eventDate } = req.body;

    if (typeof eventDate !== 'string' && eventDate != null) {
      throw new ParameterError('パラメーターが不正です');
    }

    if (!process.env.INCOMMING_WEB_HOOK) {
      throw new Error('Slack用の環境変数が未設定です。');
    }

    if (eventDate) {
      const usecase = new TeaPartyCreateUsecase(
        TeaPartyRepositoryFactory.getInstance(),
        MemberRepositoryFactory.getInstance(),
        TeaPartyNotificationGatewayFactory.getInstance()
      );
      await usecase.execute({ eventDate });
    } else {
      const usecase = new TeaPartyCreateMostRecentUsecase(
        TeaPartyRepositoryFactory.getInstance(),
        MemberRepositoryFactory.getInstance(),
        TeaPartyNotificationGatewayFactory.getInstance()
      );
      await usecase.execute({ today: new Date() });
    }
  })
);

router.put(
  '/groups',
  requestWrapper(async (req) => {
    const { groups, eventDate } = req.body;

    if (typeof eventDate !== 'string' || !Array.isArray(groups)) {
      throw new ParameterError('パラメーターが不正です');
    }
    console.log(JSON.stringify(groups, null, 4), eventDate);

    if (!process.env.INCOMMING_WEB_HOOK) {
      throw new Error('Slack用の環境変数が未設定です。');
    }

    const usecase = new TeaPartyGroupSaveUsecase({
      teaPartyRepository: TeaPartyRepositoryFactory.getInstance(),
      memberRepository: MemberRepositoryFactory.getInstance(),
      teaPartyNotificationGateway:
        TeaPartyNotificationGatewayFactory.getInstance(),
    });

    await usecase.execute({
      eventDate,
      groups,
    });
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
