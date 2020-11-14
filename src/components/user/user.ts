import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

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
     *
     */
    @prop()
    name: string;

    /**
     * googleAuth
     * @description google oAuth
     */
    @prop({ default: false })
    googleAuth?: boolean;

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

