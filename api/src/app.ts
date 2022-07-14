import Express from 'express';
import { router as teaPartyRouter } from './domains/tea-party/presenters/express-router/express-tea-party-router';
import { router as memberRouter } from './domains/member/presenters/express-router/express-member-router';

const LISTEN_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const LISTEN_HOST = process.env.HOST ?? '0.0.0.0';

(async () => {
  const app = Express();
  app.use(Express.json());

  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).send();
    }

    next();
  });

  app.use('/teaparty', teaPartyRouter);
  app.use('/members', memberRouter);

  app.listen(LISTEN_PORT, LISTEN_HOST, () => {
    console.log(`start listening ${LISTEN_HOST}:${LISTEN_PORT}`);
  });
})();
