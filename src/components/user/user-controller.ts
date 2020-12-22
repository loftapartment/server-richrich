import { IBase } from "../base-model";
import { IModel } from "./model";
import { GoogleAuthHelper, Utility, AuthTokenHelper } from "../../../src/helpers";
import { UserDAL } from "./user-dal";

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
                    imageSrc: user.imageSrc,
                    role: IModel.ERole[user.role],
                    friends,
                    groups
                }
            }));
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
                    imageSrc: user.imageSrc,
                    role: IModel.ERole[user.role],
                    friends,
                    groups
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
    export async function signUpGoogle(input: InputC): Promise<string> {
        try {
            if (!('googleIdToken' in input)) {
                return undefined;
            }

            await GoogleAuthHelper.verify(input.googleIdToken);

            // check whether already sign up
            let user: IModel.User = new IModel.User();
            await user.queryByField({
                equals: {
                    email: input.email
                }
            });

            let isCreate: boolean = !user.id;
            if (isCreate) {
                let data: IBase.MongoData<IModel.IUser> = {
                    name: input.name,
                    role: IModel.ERole.User,
                    email: input.email,
                    password: undefined,
                    googleAuth: true
                };

                if ('gender' in input) {
                    data.gender = IModel.EGender[input.gender];
                }

                if ('role' in input) {
                    data.role = IModel.ERole[input.role];
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
                let data = user.data;
                data.name = input.name;
                data.googleAuth = true;

                if ('gender' in input) {
                    data.gender = IModel.EGender[input.gender];
                }

                if ('role' in input) {
                    data.role = IModel.ERole[input.role];
                }

                if ('groupIds' in input) {

                }

                if ('friendIds' in input) {

                }

                if ('imageBase64' in user) {

                }
            }

            await user.save();

            return getToken({
                id: user.id,
                name: input.name,
                email: input.email,
                role: input.role
            });

        } catch (error) {
            throw Utility.getError(`google: ${error}`);
        }
    }

    export interface IAuthTokenFields {
        id: string;
        email: string;
        name: string;
        role: string;
    }
    function getToken(data: IAuthTokenFields): string {
        return AuthTokenHelper.encodePayload<IAuthTokenFields>(data);
    }

    export function setTokenCookie(token: string): void {

    }





}