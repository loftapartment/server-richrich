import express, { Request, Response } from 'express';
import { IModel } from './model';
import { Utility } from '../../helpers';
import { Middleware } from '../../middlewares';
import { UserController } from './user-controller';

const _API_BASE = process.env.API_BASE;

export const UserApi = express.Router();

UserApi
    .route(`${_API_BASE}/user`)
    .get(
        [
            Middleware.permission([IModel.ERole.Admin])
        ],
        async (req: Request, res: Response) => {
            try {
                let results: IModel.IResponse.IUserR[] = await UserController.getAllUsers();

                results = Utility.removeRebundants(results);

                res.json(results);
            } catch (error) {
                res.status(500).end(error);
            }
        });

type InputLogin = IModel.IRequest.ILogin;
type OutputLogin = IModel.IResponse.IUserR;
UserApi
    .route(`${_API_BASE}/user/login`)
    .post(
        [
            Middleware.validate((_input) => {
                let data: InputLogin = _input;
                if ('googleIdToken' in data) {
                    return data;
                } else if ('session' in data) {
                    return data;
                } else if (!data.email || !data.password) {
                    throw Utility.getError('googleIdToken or email/password can not empty', 400);
                }

                return data;
            })
        ],
        async (req: Request, res: Response) => {
            let _input: InputLogin = res['input'];
            let output: OutputLogin = undefined;

            try {
                let user: IModel.User = new IModel.User();
                if ('googleIdToken' in _input) {
                    user = await UserController.getUserFromGoogle(_input.googleIdToken);
                } else if ('session' in _input) {
                    user = await UserController.getUserFromSession(_input.session);
                } else {
                    user = await UserController.getUser(_input);
                }

                if (!user.id) {
                    throw Utility.getError('user not found', 400);
                }

                let data = user.data;
                let authToken: string = UserController.getToken({
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    role: IModel.ERole[data.role]
                });

                UserController.setTokenCookie(res, authToken);

                output = {
                    id: data._id.toHexString(),
                    email: data.email,
                    name: data.name,
                    gender: IModel.EGender[data.gender],
                    friends: [],
                    groups: [],
                    googleAuth: data.googleAuth,
                    imageSrc: data.imageSrc,
                    role: IModel.ERole[data.role]
                }

                res.send(Utility.removeRebundant(output));
            } catch (error) {
                UserController.setTokenCookieExpired(res);
                res.status(error.statusCode || 400).end(error.message);
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
            let output: OutputLogin = undefined;

            try {
                let user: IModel.User = undefined;

                if ('googleIdToken' in _input) {
                    user = await UserController.signUpGoogle(_input);
                } else {
                    user = await UserController.signUp(_input);
                }

                let data = user.data;
                let authToken: string = UserController.getToken({
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    role: IModel.ERole[data.role]
                });

                UserController.setTokenCookie(res, authToken);

                output = {
                    id: data._id.toHexString(),
                    email: data.email,
                    name: data.name,
                    gender: IModel.EGender[data.gender],
                    friends: [],
                    groups: [],
                    googleAuth: data.googleAuth,
                    imageSrc: data.imageSrc,
                    role: IModel.ERole[data.role]
                }

                res.send(Utility.removeRebundant(output));
            } catch (error) {
                res.status(error.statusCode || 400).end(error.message);
            }
        });


UserApi
    .route(`${_API_BASE}/user/logout`)
    .post(
        async (req: Request, res: Response) => {
            try {
                UserController.setTokenCookieExpired(res);
                return res.send(new Date());
            } catch (error) {
                res.status(error.statusCode || 400).end(error.message);
            }
        });



