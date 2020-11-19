import { IBase } from "../base-model";
import { UserComponent } from ".";

export namespace UserController {
    /**
     * getAllUsers
     */
    export async function getAllUsers(): Promise<UserComponent.IModel.IResponse.IUserR[]> {
        try {
            let users: IBase.MongoData<UserComponent.IUser>[] = await UserComponent.UserDAL.getAllUsers();

            return await Promise.all(users.map(async (user) => {
                let friends: IBase.IResponse.IObject[] = [];

                let groups: IBase.IResponse.IObject[] = [];

                return {
                    id: user._id.toHexString(),
                    email: user.email,
                    name: user.name,
                    imageSrc: user.imageSrc,
                    role: UserComponent.ERole[user.role],
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
    export async function getUsers(src: Partial<UserComponent.IUser>, options: IBase.IGetOptions<UserComponent.IUser>): Promise<UserComponent.IModel.IResponse.IUserR[]> {
        try {
            let users: IBase.MongoData<UserComponent.IUser>[] = await UserComponent.UserDAL.getUsers(src, options);
            return await Promise.all(users.map(async (user) => {
                let friends: IBase.IResponse.IObject[] = [];

                let groups: IBase.IResponse.IObject[] = [];

                return {
                    id: user._id.toHexString(),
                    email: user.email,
                    name: user.name,
                    imageSrc: user.imageSrc,
                    role: UserComponent.ERole[user.role],
                    friends,
                    groups
                }
            }));
        } catch (error) {
            throw error;
        }
    }

}