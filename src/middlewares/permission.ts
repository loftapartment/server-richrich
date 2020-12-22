import { RequestHandler } from 'express';
import { UserComponent } from '../components';
import { AuthTokenHelper, Utility } from '../helpers';
import { IModel } from '../components/user/model';

export const permission = (roles: UserComponent.IModel.ERole[]): RequestHandler => async (req, res, next) => {
    const session: string = req.cookies.session;
    if (!session) {
        return res.status(401).end('Unauthorized');
    }

    try {
        let user = AuthTokenHelper.decodePayload<UserComponent.UserController.IAuthTokenFields>(session);

        if (roles.indexOf(IModel.ERole[user.role]) === -1) {
            return res.status(403).end('Permission Denied');
        }

        if (Utility.isExpired(user.exp)) {
            return res.status(401).end('Session expired');
        }

        req['user'] = user;
    } catch (error) {
        return res.status(401).end('Unauthorized');
    }

    next();
};
