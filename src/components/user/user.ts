import { IBase } from '../base-model';

import { getModelForClass, ModelOptions, mongoose, prop } from '@typegoose/typegoose';
import { IUser } from '.';

export enum ERole {
    Admin = 1,
    ProUser,
    User,
}

@ModelOptions({ schemaOptions: { timestamps: true, collection: 'User' } })
export class UserClass {
    /**
     * email
     * @unique
     * @description use email as account
     */
    @prop()
    email: string;

    /**
     *
     */
    @prop()
    password: string;

    /**
     * googleAuth
     * @description google oAuth
     */
    @prop({ default: false })
    googleAuth?: boolean;

    /**
     *
     */
    @prop()
    name: string;

    /**
     *
     */
    @prop({ default: ERole.User })
    role?: ERole;

    /**
     * groupIds
     * @class Group
     */
    @prop()
    groupIds?: string[];

    /**
     * friendIds
     * @class User
     */
    @prop()
    friendIds?: string[];

    /**
     * image src
     */
    @prop()
    imageSrc?: string;

    /**
     *
     */
    @prop()
    friendYouOweIds?: string[];

    /**
     *
     */
    @prop()
    friendWhoOweIds?: string[];

    /**
     *
     */
    @prop()
    groupYouOweIds?: string[];

    /**
     *
     */
    @prop()
    groupWhoOweIds?: string[];

    /**
     * 
     */
    public static async validate(): Promise<void> {
        try {

        } catch (error) {
            throw error;
        }
    }
}

export const User = getModelForClass(UserClass);

//#region request

//#endregion

//#region response
export interface IUserR {
    id: string;
    email: UserClass['email'];
    name: UserClass['name'];
    role: string;
    groups: IBase.IResponse.IObject[];
    friends: IBase.IResponse.IObject[];
    imageSrc: string;
}
//#endregion
