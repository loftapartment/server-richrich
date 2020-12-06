import { RequestHandler } from 'express';
import { UserComponent } from '../components';
import { AuthTokenHelper } from '../helpers';

export const permission = (roles: UserComponent.IModel.ERole[]): RequestHandler => async (req, res, next) => {
    // if (!req.headers.authorization) {
    //     return res.status(401).end('Unauthorized');
    // }
    try {
        // const token: string = req.headers.authorization.replace('Bearer ', '');

        // let user = AuthTokenHelper.decodePayload<UserComponent.IModel.IUser>(token);

    } catch (error) {
        return res.status(403).end('Permission Denied');
    }

    next();
};
