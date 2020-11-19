import { UserComponent } from '../components';
import { RequestHandler } from 'express';
import { Utility } from '../helpers';

export interface INamespace {
    validate: Function
}

export const validate = (namespace: INamespace): RequestHandler => async (req, res, next) => {
    if (!req.body) {
        return res.status(400).end('body can not empty');
    }

    const _input = req.body;

    try {
        res['input'] = await namespace.validate(_input);
    } catch (error) {
        return res.status(400).end(Utility.handleError(error));
    }

    next();
};
