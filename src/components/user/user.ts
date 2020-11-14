import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import { Utility, Validator } from '../../helpers';
import { IUser } from '.';

export enum ERole {
    Admin = 1,
    ProUser,
    User,
}

export enum EGender {
    male = 1,
    female,
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
     * 
     */
    @prop()
    gender?: EGender;

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
    public static async validate(input: IUser.IModel.IRequest.IUserC | IUser.IModel.IRequest.IUserU): Promise<void> {
        try {
            Utility.validateEmpty('email', input, true);
            if (!Validator.isEmail(input.email)) {
                throw new Error('email format invalid');
            }

            Utility.validateEmpty('name', input, true);

            if ('gender' in input) {
                let validateValues: string[] = Utility.getEnumKeys(EGender);
                if (validateValues.indexOf(input.gender) === -1) {
                    throw new Error(`gender should be 'male' or 'female'`);
                }
            }

            if ('groupIds' in input) {
                if (!Array.isArray(input.groupIds)) {
                    throw new Error(`groupIds should be an string array`);
                }
            }

            if ('friendIds' in input) {
                if (!Array.isArray(input.groupIds)) {
                    throw new Error(`groupIds should be an string array`);
                }
            }

            Utility.validateEmpty('imageBase64', input);

            if ('googleIdToken' in input) {
                Utility.validateEmpty('googleIdToken', input, true);
            } else if (!input.password) {
                throw new Error('googleIdToken and password can not both empty');
            }

            /// check repeat
            let excludeId: string = '';
            if ('id' in input) {
                excludeId = input.id;
            }

            await Utility.checkRepeat('email', User.collection.name, input, excludeId);

        } catch (error) {
            throw error;
        }
    }
}

export const User = getModelForClass(UserClass);

