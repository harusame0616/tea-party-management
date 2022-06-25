import Express from 'express';
import { router as teaPartyRouter } from './domains/tea-party/presenters/express-router/express-tea-party-router';

const LISTEN_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const LISTEN_HOST = process.env.HOST ?? '0.0.0.0';

(async () => {
  const app = Express();
  app.use(Express.json());

  app.use('/teaparty', teaPartyRouter);

  app.listen(LISTEN_PORT, LISTEN_HOST, () => {
    console.log(`start listening ${LISTEN_HOST}:${LISTEN_PORT}`);
  });
})();
