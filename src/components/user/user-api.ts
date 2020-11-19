import express, { Request, Response } from 'express';
import { IModel } from './model';
import { UserComponent } from '../index';
import { Utility } from '../../helpers';
import { Middleware } from '../../middlewares';

const _API_BASE = process.env.API_BASE;

export const UserApi = express.Router();

UserApi
    .route(`${_API_BASE}/user`)
    .get(
        [
            Middleware.permission
        ],
        async (req: Request, res: Response) => {
            try {
                let results: IModel.IResponse.IUserR[] = await UserComponent.UserController.getAllUsers();

                results = Utility.removeRebundant(results);

                res.json(results);
            } catch (error) {
                res.status(500).end(error);
            }
        });

UserApi.route(`${_API_BASE}/user/sign-up`)
    .post(
        [
            Middleware.validate('User')
        ],
        async (req: Request, res: Response) => {
            let _input: IModel.IRequest.IUserC = res['input'];

            try {
                let isGoogle: boolean = !!_input['googleIdToken'];
                if (isGoogle) {
                    // check whether this email is already binding


                } else {

                }

                res.send(new Date());
            } catch (error) {
                res.end(error);
            }
        });




