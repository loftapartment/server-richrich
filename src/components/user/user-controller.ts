import { IBase } from "../base-model";
import { IModel } from "./model";
import { GoogleAuthHelper, Utility } from "../../../src/helpers";
import { UserDAL } from "./user-dal";

type InputC = IModel.IRequest.IUserC;
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

    export async function signUpGoogle(_input: InputC) {
        try {
            if ('googleIdToken' in _input) {
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
            }
    
        } catch (error) {
            throw Utility.getError(`google: ${error}`);
        }
    }

}