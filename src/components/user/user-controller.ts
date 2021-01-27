import { IBase } from '../base-model';
import { IModel } from './model';
import { GoogleAuthHelper, Utility, AuthTokenHelper, DateService } from '../../../src/helpers';
import { UserDAL } from './user-dal';
import { LoginTicket } from 'google-auth-library';
import BCrypt from 'bcrypt';
import { Response } from 'express';
import { ObjectId } from 'mongodb';

export namespace UserController {
    /**
     * getAllUsers
     */
    export async function getAllUsers(): Promise<IModel.IResponse.IUserR[]> {
        try {
            let users: IBase.MongoData<IModel.IUser>[] = await UserDAL.getAllUsers();

            return await Promise.all(
                users.map(async (user) => {
                    let friends: IBase.IResponse.IObject[] = [];

                    let groups: IBase.IResponse.IObject[] = [];

                    return {
                        id: user._id.toHexString(),
                        email: user.email,
                        name: user.name,
                        gender: IModel.EGender[user.gender],
                        imageSrc: user.imageSrc,
                        role: IModel.ERole[user.role],
                        friends,
                        groups,
                        googleAuth: user.googleAuth,
                    };
                }),
            );
        } catch (error) {
            throw error;
        }
    }

    export async function getAllUserTokenExpiredDate(): Promise<
        IModel.IResponse.IUserTokenExpiredDate[]
    > {
        try {
            let users: IBase.MongoData<IModel.IUser>[] = await UserDAL.getAllUsers();

            return users.map((user) => {
                return {
                    id: user._id.toHexString(),
                    tokenValidStartDate: new Date(user.tokenValidStartDate),
                };
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * getUsers
     */
    export async function getUsers(): Promise<IModel.IResponse.IUserR[]>;
    export async function getUsers(
        options: IBase.IGetOptions<IModel.IUser>,
    ): Promise<IModel.IResponse.IUserR[]>;
    export async function getUsers(
        options?: IBase.IGetOptions<IModel.IUser>,
    ): Promise<IModel.IResponse.IUserR[]> {
        try {
            let users: IBase.MongoData<IModel.IUser>[] = await UserDAL.getUsers(options);
            return await Promise.all(
                users.map(async (user) => {
                    let friends: IBase.IResponse.IObject[] = [];

                    let groups: IBase.IResponse.IObject[] = [];

                    return {
                        id: user._id.toHexString(),
                        email: user.email,
                        name: user.name,
                        gender: IModel.EGender[user.gender],
                        imageSrc: user.imageSrc,
                        role: IModel.ERole[user.role],
                        friends,
                        groups,
                        googleAuth: user.googleAuth,
                    };
                }),
            );
        } catch (error) {
            throw error;
        }
    }

    type InputC = IModel.IRequest.IUserC;
    /**
     *
     * @param input
     */
    export async function signUpGoogle(input: InputC): Promise<IModel.User> {
        try {
            if (!('googleIdToken' in input)) {
                throw `googleIdToken can not empty`;
            }

            // check whether already sign up
            let user: IModel.User = await getUserFromGoogle(input.googleIdToken);
            let data: IBase.MongoData<IModel.IUser> = undefined;

            let isCreate: boolean = !user;
            if (isCreate) {
                user = new IModel.User();

                user.setValue('name', input.name)
                    .setValue('role', IModel.ERole.User)
                    .setValue('email', input.email)
                    .setValue('googleAuth', true);

                if ('gender' in input) {
                    user.setValue('gender', IModel.EGender[input.gender]);
                }

                if ('groupIds' in input) {
                }

                if ('friendIds' in input) {
                    user.setValue('friendIds', input.friendIds);
                }

                if ('imageBase64' in user) {
                }
            } else {
                /// update
                user.setValue('name', input.name).setValue('googleAuth', true);

                if ('gender' in input) {
                    user.setValue('gender', IModel.EGender[input.gender]);
                } else {
                    user.unset('gender');
                }

                if ('groupIds' in input) {
                } else {
                    user.unset('groupIds');
                }

                if ('friendIds' in input) {
                    let friendIds: string[] = await handleReqFriendIds(input.friendIds, user.id);
                    user.setValue('friendIds', friendIds);
                } else {
                    user.unset('friendIds');
                }

                /// TODO delete image src
                if ('imageBase64' in user) {
                } else {
                    user.unset('imageSrc');
                }
            }

            data.tokenValidStartDate = new Date();

            await user.save();

            return user;
        } catch (error) {
            throw Utility.getError(error, 400);
        }
    }

    async function handleReqFriendIds(friendIds: string[], excludeId: string): Promise<string[]> {
        friendIds = (friendIds || []).filter((x) => x !== excludeId);
        let friendObjectIds: ObjectId[] = friendIds.map((id) => new ObjectId(id));
        let friends = await UserDAL.getUsers({
            _id: {
                $in: friendObjectIds,
            },
        });

        return friends.map((friend) => friend._id.toHexString());
    }

    export async function handleResFriends(
        friendIds: string[],
        excludeId: string,
    ): Promise<IBase.IResponse.IObject[]> {
        friendIds = (friendIds || []).filter((x) => x !== excludeId);
        let friendObjectIds: ObjectId[] = friendIds.map((id) => new ObjectId(id));
        let friends = await UserDAL.getUsers({
            _id: {
                $in: friendObjectIds,
            },
        });

        return friends.map((friend) => {
            return {
                id: friend._id.toHexString(),
                name: friend.name,
            };
        });
    }

    export async function getUserFromGoogle(token: string): Promise<IModel.User> {
        let ticket: LoginTicket = undefined;
        let email: string = undefined;
        try {
            ticket = await GoogleAuthHelper.verify(token);
            email = ticket.getPayload().email;
        } catch (error) {
            throw Utility.getError(`google: ${error}`, 400);
        }

        // check whether already sign up
        let user: IModel.User = await new IModel.User().queryByField({
            equals: {
                googleAuth: true,
                email: email,
            },
        });

        return user;
    }

    export async function getUserFromSession(session: string): Promise<IModel.User> {
        let payload = AuthTokenHelper.decodePayload<UserController.IAuthTokenFields>(session);
        if (DateService.isExpiredMs(payload.exp)) {
            throw Utility.getError('Session Expired', 401);
        }

        let user: IModel.User = new IModel.User();
        await user.queryByField({
            equals: {
                email: payload.email,
            },
        });

        return user;
    }

    export async function getUser(input: IModel.IRequest.ILoginBasic): Promise<IModel.User> {
        let user: IModel.User = new IModel.User();
        await user.queryByField({
            equals: {
                email: input.email,
            },
        });

        if (!user.id) {
            throw Utility.getError('email or password not correct', 400);
        }

        let password: string = user.getValue('password');
        if (!isPasswordSame(input.password, password)) {
            throw Utility.getError('email or password not correct', 400);
        }

        return user;
    }

    /**
     *
     * @param input
     */
    export async function signUp(
        input: InputC,
        role: IModel.ERole = IModel.ERole.User,
    ): Promise<IModel.User> {
        try {
            if (!('password' in input)) {
                throw `password can not empty`;
            }

            let user: IModel.User = new IModel.User();
            user.setValue('name', input.name)
                .setValue('role', role)
                .setValue('email', input.email)
                .setValue('password', getHashPassword(input.password))
                .setValue('googleAuth', false)
                .setValue('tokenValidStartDate', new Date());

            if ('gender' in input) {
                user.setValue('gender', IModel.EGender[input.gender]);
            }

            if ('groupIds' in input) {
            }

            if ('friendIds' in input) {
                let friendIds: string[] = await handleReqFriendIds(input.friendIds, user.id);
                user.setValue('friendIds', friendIds);
            }

            if ('imageBase64' in user) {
            }

            await user.save();

            return user;
        } catch (error) {
            throw Utility.getError(error);
        }
    }

    function getHashPassword(password: string): string {
        const salt = BCrypt.genSaltSync(10);
        return BCrypt.hashSync(password, salt);
    }

    export interface IAuthTokenFields {
        id: string;
        email: string;
        name: string;
        role: string;
    }
    export function getToken(data: IAuthTokenFields): string {
        return AuthTokenHelper.encodePayload<IAuthTokenFields>(data);
    }

    export function setTokenCookie(res: Response, token: string): void {
        res.cookie('session', token, { httpOnly: true });
    }

    export function setTokenCookieExpired(res: Response): void {
        res.cookie('session', null, { expires: new Date() });
    }

    export type InputProfile = IModel.IRequest.IUserProfile & { id: string };
    export async function updateProfile(input: InputProfile): Promise<IModel.User> {
        try {
            let user = await new IModel.User().query(input.id);

            if (!user) {
                throw 'user not found';
            }

            user.setValue('name', input.name);

            if ('gender' in input) {
                user.setValue('gender', IModel.EGender[input.gender]);
            } else {
                user.unset('gender');
            }

            if ('groupIds' in input) {
            }

            if ('friendIds' in input) {
                let friendIds: string[] = await handleReqFriendIds(input.friendIds, user.id);
                user.setValue('friendIds', friendIds);
            } else {
                user.unset('friendIds');
            }

            if ('imageBase64' in user) {
            }

            await user.save(false);

            return user;
        } catch (error) {
            throw error;
        }
    }

    export type InputPassword = IModel.IRequest.IChangePassword & {
        id: string;
    };
    export async function changePassword(input: InputPassword): Promise<IModel.User> {
        let user: IModel.User = await new IModel.User().query(input.id);

        if (!user) {
            throw 'user not found';
        }

        // check previous password is same
        let password: string = user.getValue('password');
        if (!isPasswordSame(input.previous, password)) {
            throw 'previous password not the same';
        }

        user.setValue('password', getHashPassword(input.current));

        user.setValue('tokenValidStartDate', new Date());

        await user.save();

        return user;
    }

    function isPasswordSame(password1: string, password2: string): boolean {
        return BCrypt.compareSync(password1, password2);
    }
}
