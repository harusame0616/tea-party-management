import { ConflictError } from '@/errors/conflict-error';
import { NotFoundError } from '@/errors/not-found-error';
import { ParameterError } from '@/errors/parameter-error';
import Express from 'express';

type requestHandler = (
  req: Express.Request,
  res?: Express.Response
) => Promise<any>;

export const requestWrapper = (endPoiintHandler: requestHandler) => {
  return async (req: Express.Request, res: Express.Response) => {
    const [result, code] = await (async () => {
      try {
        return [await endPoiintHandler(req, res), 200];
      } catch (error: any) {
        console.error(error);
        let code = 500;

        if (error instanceof ParameterError) {
          code = 400;
        } else if (error instanceof NotFoundError) {
          code = 404;
        } else if (error instanceof ConflictError) {
          code = 409;
        } else {
          // do nothing
        }

        return [error?.message ?? '不明なエラーが発生しました。', code];
      }
    })();

    res.status(code).send(result ?? {});
  };
};
