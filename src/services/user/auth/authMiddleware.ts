import * as core from 'express-serve-static-core';
import { log } from 'src/lib/log';
import { con } from 'src/services/database';
import { UserSession } from 'src/services/entities/UserSession';

interface ISessionRequest extends core.Request {
  session: UserSession;
}

export const authMiddleware = (next: (req: ISessionRequest, res: core.Response, next: core.NextFunction) => void) => {
  return async (req: ISessionRequest, res: core.Response, outerNext: core.NextFunction) => {
    const fail = () => {
      res.sendStatus(401);
      res.send({success: false});
    };
    if (!req.cookies.sessionKey) {
      fail();
      return;
    }

    const session = await (await con())
      .getRepository(UserSession)
      .findOne({
        where: {sessionKey: req.cookies.sessionKey},
        join: {
          alias: 'userSession',
          leftJoinAndSelect: {
            user: 'userSession.user',
          },
        },
      });

    if(!session) {
      fail();
      return;
    }

    req.session = session;

    next(req, res, outerNext);
  };
};
