import express, { Request, Response } from 'express';
import { IModel } from './model';
import { UserComponent } from '../index';
import { Utility } from '../../helpers';
import { Middleware } from '../../middlewares';
import { UserController } from './user-controller';

const _API_BASE = process.env.API_BASE;

export const UserApi = express.Router();

UserApi
    .route(`${_API_BASE}/user`)
    .get(
        [
            Middleware.permission([])
        ],
        async (req: Request, res: Response) => {
            try {
                let results: IModel.IResponse.IUserR[] = await UserComponent.UserController.getAllUsers();

                results = Utility.removeRebundants(results);

                res.json(results);
            } catch (error) {
                res.status(500).end(error);
            }
        });

type InputC = IModel.IRequest.IUserC;
UserApi
    .route(`${_API_BASE}/user/sign-up`)
    .post(
        [
            Middleware.validate(IModel.User.validate)
        ],
        async (req: Request, res: Response) => {
            let _input: InputC = res['input'];

            try {
                /// google auth
                if ('googleIdToken' in _input) {
                    UserController.signUpGoogle(_input);
                } else {
                    /// general

                }

                res.send(new Date());
            } catch (error) {
                res.status(error.statusCode).end(error instanceof Error ? error.message : error);
            }
        });





