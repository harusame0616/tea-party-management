import { LocalFileMemberRepository } from '@/domains/member/local-file-repository/local-file-member-repository';
import { requestWrapper } from '@/utils/presenter/request-handler';
import { ParameterError } from 'errors/parameter-error';
import Express from 'express';
import { TeaPartyCreateUsecase } from '../../applications/tea-party-create-usecase';
import { SlackTeaPartyNotificationGateway } from '../../infrastructures/tea-party-notification-gateway/slack-tea-party-notification-gateway';
import { LocalFileTeaPartyRepository } from '../../infrastructures/tea-party-repository/local-file-tea-party-repository';

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
      new LocalFileTeaPartyRepository(),
      new LocalFileMemberRepository(),
      new SlackTeaPartyNotificationGateway({
        incommingWebHook: process.env.INCOMMING_WEB_HOOK,
      })
    );

    await teaPartyCreateUsecase.execute({ eventDate });
  })
);

router.post(
  '/',
  requestWrapper(async (req) => {
    const { eventDate } = req.body;

    if (typeof eventDate !== 'string') {
      throw new ParameterError('パラメーターが不正です');
    }

    await teaPartyCreateUsecase.execute({ eventDate });
  })
);
