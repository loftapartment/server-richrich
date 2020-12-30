import { RequestHandler } from 'express';
import { UserComponent } from '../components';
import { AuthTokenHelper, DateService } from '../helpers';
import { IModel } from '../components/user/model';
import { DataCenter } from '../../src/services/data-center';

export const permission = (roles?: UserComponent.IModel.ERole[]): RequestHandler => async (req, res, next) => {
    const session: string = req.cookies.session;
    if (!session) {
        return res.status(401).end('Unauthorized');
    }

    try {
        let user = AuthTokenHelper.decodePayload<UserComponent.UserController.IAuthTokenFields>(session);

        let validDate: Date = DataCenter.userIdTokenExpiredDateDict[user.id];
        if (validDate && user.iat < validDate.getTime()) {
            UserComponent.UserController.setTokenCookieExpired(res);
            return res.status(401).end('Session Expired');
        }

        if (Array.isArray(roles)) {
            if (roles.indexOf(IModel.ERole[user.role]) === -1) {
                return res.status(403).end('Permission Denied');
            }
        }

        if (DateService.isExpiredMs(user.exp)) {
            UserComponent.UserController.setTokenCookieExpired(res);
            return res.status(401).end('Session Expired');
        }

        req['user'] = user;
    } catch (error) {
        return res.status(401).end('Unauthorized');
    }

    next();
};
