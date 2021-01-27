import express, { Request, Response } from 'express';
import { IModel } from './model';
import { Utility } from '../../helpers';
import { Middleware } from '../../middlewares';
import { UserController } from './user-controller';

const _API_BASE = process.env.API_BASE;

export const UserApi = express.Router();

UserApi.route(`${_API_BASE}/user`).get(
    [Middleware.permission([IModel.ERole.Admin])],
    async (req: Request, res: Response) => {
        try {
            let results: IModel.IResponse.IUserR[] = await UserController.getAllUsers();

            results = Utility.removeRebundants(results);

            res.json(results);
        } catch (error) {
            res.status(500).end(error);
        }
    },
);

type InputLogin = IModel.IRequest.ILogin;
type OutputLogin = IModel.IResponse.IUserR;
UserApi.route(`${_API_BASE}/user/login`).post(
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
        }),
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

            let authToken: string = UserController.getToken({
                id: user.id,
                name: user.getValue('name'),
                email: user.getValue('email'),
                role: IModel.ERole[user.getValue('role')],
            });

            UserController.setTokenCookie(res, authToken);

            output = {
                id: user.id,
                email: user.getValue('email'),
                name: user.getValue('name'),
                gender: IModel.EGender[user.getValue('gender')],
                friends: await UserController.handleResFriends(user.getValue('friendIds'), user.id),
                groups: [],
                googleAuth: user.getValue('googleAuth'),
                imageSrc: user.getValue('imageSrc'),
                role: IModel.ERole[user.getValue('role')],
            };

            res.send(Utility.removeRebundant(output));
        } catch (error) {
            UserController.setTokenCookieExpired(res);
            res.status(error.statusCode || 400).end(error.message);
        }
    },
);

UserApi.route(`${_API_BASE}/user/logout`).post(async (req: Request, res: Response) => {
    try {
        UserController.setTokenCookieExpired(res);
        return res.send(new Date());
    } catch (error) {
        res.status(error.statusCode || 400).end(error.message);
    }
});

type InputC = IModel.IRequest.IUserC;
UserApi.route(`${_API_BASE}/user/sign-up`).post(
    [Middleware.validate(IModel.User.validate)],
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

            let authToken: string = UserController.getToken({
                id: user.id,
                name: user.getValue('name'),
                email: user.getValue('email'),
                role: IModel.ERole[user.getValue('role')],
            });

            UserController.setTokenCookie(res, authToken);

            output = {
                id: user.id,
                email: user.getValue('email'),
                name: user.getValue('name'),
                gender: IModel.EGender[user.getValue('gender')],
                friends: await UserController.handleResFriends(user.getValue('friendIds'), user.id),
                groups: [],
                googleAuth: user.getValue('googleAuth'),
                imageSrc: user.getValue('imageSrc'),
                role: IModel.ERole[user.getValue('role')],
            };

            res.send(Utility.removeRebundant(output));
        } catch (error) {
            res.status(error.statusCode || 400).end(error.message);
        }
    },
);

type InputProfile = UserController.InputProfile;
UserApi.route(`${_API_BASE}/user/info`).put(
    [Middleware.permission(), Middleware.validate(IModel.User.validateProfile)],
    async (req: Request, res: Response) => {
        let _input: InputProfile = res['input'];
        let output: OutputLogin = undefined;

        _input.id = req['user'].id;
        try {
            let user: IModel.User = undefined;
            try {
                user = await UserController.updateProfile(_input);
            } catch (error) {
                throw Utility.getError(error, 400);
            }

            let authToken: string = UserController.getToken({
                id: user.id,
                name: user.getValue('name'),
                email: user.getValue('email'),
                role: IModel.ERole[user.getValue('role')],
            });

            UserController.setTokenCookie(res, authToken);

            output = {
                id: user.id,
                email: user.getValue('email'),
                name: user.getValue('name'),
                gender: IModel.EGender[user.getValue('gender')],
                friends: await UserController.handleResFriends(user.getValue('friendIds'), user.id),
                groups: [],
                googleAuth: user.getValue('googleAuth'),
                imageSrc: user.getValue('imageSrc'),
                role: IModel.ERole[user.getValue('role')],
            };

            res.send(Utility.removeRebundant(output));
        } catch (error) {
            res.status(error.statusCode || 400).end(error.message);
        }
    },
);

type InputPassword = UserController.InputPassword;
UserApi.route(`${_API_BASE}/user/change-password`).put(
    [Middleware.permission(), Middleware.validate(IModel.User.validatePassword)],
    async (req: Request, res: Response) => {
        let _input: InputPassword = res['input'];
        let output: OutputLogin = undefined;

        _input.id = req['user'].id;
        try {
            let user: IModel.User = undefined;
            try {
                user = await UserController.changePassword(_input);
            } catch (error) {
                throw Utility.getError(error, 400);
            }

            output = {
                id: user.id,
                email: user.getValue('email'),
                name: user.getValue('name'),
                gender: IModel.EGender[user.getValue('gender')],
                friends: await UserController.handleResFriends(user.getValue('friendIds'), user.id),
                groups: [],
                googleAuth: user.getValue('googleAuth'),
                imageSrc: user.getValue('imageSrc'),
                role: IModel.ERole[user.getValue('role')],
            };

            res.send(Utility.removeRebundant(output));
        } catch (error) {
            res.status(error.statusCode || 400).end(error.message);
        }
    },
);
