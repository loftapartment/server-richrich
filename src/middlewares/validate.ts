import { RequestHandler } from 'express';
import { Utility } from '../helpers';
import { IBase } from 'src/components/base-model';

export const validate = (model: IBase.ICollection): RequestHandler => async (req, res, next) => {
    if (!req.body) {
        return res.status(400).end('body can not empty');
    }

    const _input = req.body;

    try {
        res['input'] = await model.validate(_input);
    } catch (error) {
        return res.status(400).end(Utility.handleError(error));
    }

    next();
};
