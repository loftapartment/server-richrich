import express, { Request, Response } from 'express';
import { IModel } from './model';
import { Utility, AuthTokenHelper } from '../../helpers';
import { Middleware } from '../../middlewares';
import { UserController } from './user-controller';
import BCrypt from 'bcrypt';

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
                /// google auth
                if ('googleIdToken' in _input) {
                    try {
                        user = await UserController.getUserFromGoogle(_input.googleIdToken);
                    } catch (error) {
                        throw Utility.getError(`google: ${error}`, 400);
                    }

                    if (!user.id) {
                        throw Utility.getError('user not found', 400);
                    }
                } else if ('session' in _input) {
                    try {
                        let payload = AuthTokenHelper.decodePayload<UserController.IAuthTokenFields>(_input.session);
                        if (Utility.isExpired(payload.exp)) {
                            res.cookie('session', null, { expires: new Date() });
                            throw Utility.getError('Session Expired', 401);
                        }

                        await user.queryByField({
                            equals: {
                                email: payload.email
                            }
                        });
                    } catch (error) {
                        throw Utility.getError(error, 400);
                    }
                } else {
                    /// general
                    await user.queryByField({
                        equals: {
                            email: _input.email
                        }
                    })

                    if (!user.id) {
                        throw Utility.getError('email or password not correct', 400);
                    }

                    let password: string = user.data.password;
                    let isPasswordSame = BCrypt.compareSync(_input.password, password);
                    if (!isPasswordSame) {
                        throw Utility.getError('email or password not correct', 400);
                    }
                }

                let data = user.data;
                let authToken: string = UserController.getToken({
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    role: IModel.ERole[data.role]
                });

                res.cookie('session', authToken);

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
                /// google auth
                if ('googleIdToken' in _input) {
                    user = await UserController.signUpGoogle(_input);
                } else {
                    /// general
                    user = await UserController.signUp(_input);
                }

                let data = user.data;
                let authToken: string = UserController.getToken({
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    role: IModel.ERole[data.role]
                });

                res.cookie('session', authToken, { httpOnly: false });

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




