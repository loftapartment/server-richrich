import { IUser } from '../components';
import { RequestHandler } from 'express';
import { Utility } from '../helpers';

export const validate = (className: string): RequestHandler => async (req, res, next) => {
    if (!req.body) {
        return res.status(400).end('body can not empty');
    }

    const _input = req.body;

    switch (className) {
        case 'User':
            try {
                await IUser.User.validate(_input);
            } catch (error) {
                return res.status(400).end(Utility.handleError(error));
            }
            break;
    }

    next();
};
