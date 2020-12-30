import { IBase } from "../base-model";
import { IModel } from "./model";
import { GoogleAuthHelper, Utility, AuthTokenHelper, DateService } from "../../../src/helpers";
import { UserDAL } from "./user-dal";
import { LoginTicket } from "google-auth-library";
import BCrypt from 'bcrypt';
import { Response } from 'express';

export namespace UserController {
    /**
     * getAllUsers
     */
    export async function getAllUsers(): Promise<IModel.IResponse.IUserR[]> {
        try {
            let users: IBase.MongoData<IModel.IUser>[] = await UserDAL.getAllUsers();

            return await Promise.all(users.map(async (user) => {
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
                    googleAuth: user.googleAuth
                }
            }));
        } catch (error) {
            throw error;
        }
    }

    export async function getAllUserTokenExpiredDate(): Promise<IModel.IResponse.IUserTokenExpiredDate[]> {
        try {
            let users: IBase.MongoData<IModel.IUser>[] = await UserDAL.getAllUsers();

            return users.map((user) => {
                return {
                    id: user._id.toHexString(),
                    tokenValidStartDate: new Date(user.tokenValidStartDate)
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * getUsers
     */
    export async function getUsers(): Promise<IModel.IResponse.IUserR[]>
    export async function getUsers(options: IBase.IGetOptions<IModel.IUser>): Promise<IModel.IResponse.IUserR[]>
    export async function getUsers(options?: IBase.IGetOptions<IModel.IUser>): Promise<IModel.IResponse.IUserR[]> {
        try {
            let users: IBase.MongoData<IModel.IUser>[] = await UserDAL.getUsers(options);
            return await Promise.all(users.map(async (user) => {
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
                    googleAuth: user.googleAuth
                }
            }));
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

            let isCreate: boolean = !user.id;
            if (isCreate) {
                data = {
                    name: input.name,
                    role: IModel.ERole.User,
                    email: input.email,
                    password: undefined,
                    googleAuth: true,
                };

                if ('gender' in input) {
                    data.gender = IModel.EGender[input.gender];
                }

                if ('groupIds' in input) {

                }

                if ('friendIds' in input) {

                }

                if ('imageBase64' in user) {

                }

                user.data = data;
            } else {
                /// update
                data = user.data;
                data.name = input.name;
                data.googleAuth = true;

                if ('gender' in input) {
                    data.gender = IModel.EGender[input.gender];
                }

                if ('groupIds' in input) {

                }

                if ('friendIds' in input) {

                }

                if ('imageBase64' in user) {

                }
            }

            data.tokenValidStartDate = new Date();

            await user.save();

            return user;
        } catch (error) {
            throw Utility.getError(error, 400);
        }
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
        let user: IModel.User = new IModel.User();
        await user.queryByField({
            equals: {
                googleAuth: true,
                email: email
            }
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
                email: payload.email
            }
        });

        return user;
    }

    export async function getUser(input: IModel.IRequest.ILoginBasic): Promise<IModel.User> {
        let user: IModel.User = new IModel.User();
        await user.queryByField({
            equals: {
                email: input.email
            }
        })

        if (!user.id) {
            throw Utility.getError('email or password not correct', 400);
        }

        let password: string = user.data.password;
        if (!isPasswordSame(input.password, password)) {
            throw Utility.getError('email or password not correct', 400);
        }

        return user;
    }

    /**
     * 
     * @param input 
     */
    export async function signUp(input: InputC, role: IModel.ERole = IModel.ERole.User): Promise<IModel.User> {
        try {
            if (!('password' in input)) {
                throw `password can not empty`;
            }

            let user: IModel.User = new IModel.User();

            let data: IBase.MongoData<IModel.IUser> = {
                name: input.name,
                role: role,
                email: input.email,
                password: getHashPassword(input.password),
                googleAuth: false,
                tokenValidStartDate: new Date()
            };

            if ('gender' in input) {
                data.gender = IModel.EGender[input.gender];
            }

            if ('groupIds' in input) {

            }

            if ('friendIds' in input) {

            }

            if ('imageBase64' in user) {

            }

            user.data = data;

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
            let user: IModel.User = new IModel.User(input.id);
            await user.query();

            let data = user.data;

            if (!user.id) {
                throw 'user not found';
            }

            data.name = input.name;

            if ('gender' in input) {
                data.gender = IModel.EGender[input.gender];
            }

            if ('groupIds' in input) {

            }

            if ('friendIds' in input) {

            }

            if ('imageBase64' in user) {

            }

            user.data = data;

            await user.save(false);

            return user;
        } catch (error) {
            throw error;
        }
    }

    export type InputPassword = IModel.IRequest.IChangePassword & { id: string };
    export async function changePassword(input: InputPassword): Promise<IModel.User> {
        let user: IModel.User = new IModel.User(input.id);
        await user.query();

        if (!user.id) {
            throw 'user not found';
        }

        // check previous password is same
        let password: string = user.data.password;
        if (!isPasswordSame(input.previous, password)) {
            throw 'previous password not the same';
        }

        let data = user.data;

        data.password = getHashPassword(input.current);

        data.tokenValidStartDate = new Date();

        await user.save();

        return user;
    }

    function isPasswordSame(password1: string, password2: string): boolean {
        return BCrypt.compareSync(password1, password2);
    }




}