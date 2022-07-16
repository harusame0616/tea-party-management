import { MemberQueryFactory } from '@/factory/member-query';
import { requestWrapper } from '@/utils/presenter/request-handler';
import Express from 'express';
import { MemberListAllQueryUsecase } from '../../applications/member-query-usecase';

export const router = Express.Router();

router.get(
  '/',
  requestWrapper(async () => {
    const query = new MemberListAllQueryUsecase({
      memberQuery: MemberQueryFactory.getInstance(),
    });

    return await query.execute();
  })
);
