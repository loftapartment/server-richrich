import express, { Request, Response } from 'express';
import { IModel } from './model';
import { UserComponent } from '../index';
import { Utility, GoogleAuthHelper } from '../../helpers';
import { Middleware } from '../../middlewares';
import { UserController } from './user-controller';
import { MongoData } from '../base-model/_index';
import { IBase } from '../base-model';

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

                results = Utility.removeRebundant(results);

                res.json(results);
            } catch (error) {
                res.status(500).end(error);
            }
        });

UserApi
    .route(`${_API_BASE}/user/sign-up`)
    .post(
        [
            Middleware.validate(IModel.User.validate)
        ],
        async (req: Request, res: Response) => {
            let _input: IModel.IRequest.IUserC = res['input'];

            try {
                /// google auth
                if ('googleIdToken' in _input) {
                    try {
                        await GoogleAuthHelper.verify(_input.googleIdToken);

                        // check whether already sign up
                        let user: IModel.User = new IModel.User();
                        await user.queryByField({
                            equals: {
                                email: _input.email
                            }
                        });

                        if (!user.id) {
                            /// create
                            let data: IBase.MongoData<IModel.IUser> = {
                                name: _input.name,
                                role: IModel.ERole.User,
                                email: _input.email,
                                password: undefined,
                                googleAuth: true
                            };

                            if ('gender' in _input) {
                                data.gender = IModel.EGender[_input.gender];
                            }

                            if ('role' in _input) {
                                data.role = IModel.ERole[_input.role];
                            }

                            if ('groupIds' in _input) {

                            }

                            if ('friendIds' in _input) {

                            }

                            if ('imageBase64' in user) {

                            }

                            user.data = data;

                            await user.save();
                        } else {
                            /// update

                        }

                    } catch (error) {
                        throw new Error(`google: ${error}`);
                    }
                } else {
                    /// general


                }

                res.send(new Date());
            } catch (error) {
                res.status(400).end(error instanceof Error ? error.message : error);
            }
        });




