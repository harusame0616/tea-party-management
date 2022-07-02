import { MemberRepositoryFactory } from '@/factory/member-repository-factory';
import { TeaPartyNotificationGatewayFactory } from '@/factory/tea-party-notification-gateway-factory';
import { requestWrapper } from '@/utils/presenter/request-handler';
import { ParameterError } from '@/errors/parameter-error';
import Express from 'express';
import { TeaPartyRepositoryFactory } from '../../../../factory/tea-party-repository-factory';
import { TeaPartyAbsenceUsecase } from '../../applications/tea-party-absence-usecase';
import { TeaPartyCreateUsecase } from '../../applications/tea-party-create-usecase';

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
    const { eventDate, chatId, attendance } = req.query;

    if (
      typeof eventDate !== 'string' ||
      typeof chatId !== 'string' ||
      attendance !== 'absence'
    ) {
      throw new ParameterError('パラメーターが不正です');
    }

    const teaPartyAbsenceUsecase = new TeaPartyAbsenceUsecase({
      teaPartyRepository: TeaPartyRepositoryFactory.getInstance(),
      memberRepository: MemberRepositoryFactory.getInstance(),
    });

    await teaPartyAbsenceUsecase.execute({ eventDate, chatId });
  })
);
