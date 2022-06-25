import { LocalFileMemberRepository } from '@/domains/member/local-file-repository/local-file-member-repository';
import { ConflictError } from 'errors/conflict-error';
import { NotFoundError } from 'errors/not-found-error';
import { ParameterError } from 'errors/parameter-error';
import Express from 'express';
import { TeaPartyCreateUsecase } from '../../applications/tea-party-create-usecase';
import { SlackTeaPartyNotificationGateway } from '../../infrastructures/tea-party-notification-gateway/slack-tea-party-notification-gateway';
import { LocalFileTeaPartyRepository } from '../../infrastructures/tea-party-repository/local-file-tea-party-repository';

if (!process.env.INCOMMING_WEB_HOOK) {
  throw new ParameterError('Slack用の環境変数が未設定です。');
}

const teaPartyCreateUsecase = new TeaPartyCreateUsecase(
  new LocalFileTeaPartyRepository(),
  new LocalFileMemberRepository(),
  new SlackTeaPartyNotificationGateway({
    incommingWebHook: process.env.INCOMMING_WEB_HOOK,
  })
);

export const router = Express.Router();

router.post('/', async (req, res) => {
  const { eventDate } = req.body;

  if (typeof eventDate !== 'string') {
    return res.status(400).send('パラメーターが不正です。');
  }

  try {
    await teaPartyCreateUsecase.execute({ eventDate });
  } catch (error: any) {
    let status = 500;

    if (error instanceof ParameterError) {
      status = 400;
    } else if (error instanceof NotFoundError) {
      status = 404;
    } else if (error instanceof ConflictError) {
      status = 409;
    } else {
      // do nothing
    }

    return res.status(status).send(error?.message);
  }

  res.status(200).send({});
});
