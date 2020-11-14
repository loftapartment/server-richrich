import { DocumentType } from "@typegoose/typegoose";
import { IBase } from "components/base-model";
import { IUser } from ".";

export namespace UserController {
    /**
     * getAllUsers
     */
    export async function getAllUsers(): Promise<IUser.IModel.IResponse.IUserR[]> {
        try {
            let users: DocumentType<IUser.UserClass>[] = await IUser.UserDAL.getAllUsers();
            return await Promise.all(users.map(async (user) => {
                let friends: IBase.IResponse.IObject[] = (await IUser.User.find({ friendIds: user.friendIds })).map((friend) => {
                    return {
                        id: friend.id,
                        name: friend.name
                    }
                });

                let groups: IBase.IResponse.IObject[] = [];

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    imageSrc: user.imageSrc,
                    role: IUser.ERole[user.role],
                    friends,
                    groups
                }
            }));
        } catch (error) {
            throw error;
        }
    }
}