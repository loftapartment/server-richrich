import { Utility, Validator } from '../../../../helpers';
import { UserComponent } from '../../';
import { IBase } from '../../../base-model';

export enum ERole {
    Admin = 1,
    ProUser,
    User,
}

export enum EGender {
    male = 1,
    female,
}

export interface IUser {
    /**
     * email
     * @unique
     * @description use email as account
    */
    email: string;

    /**
     *
    */
    password: string;

    /**
     *
     */
    name: string;

    /**
     * 
     */
    gender?: EGender;

    /**
     * googleAuth
     * @description google oAuth
     */
    googleAuth?: boolean;

    /**
     *
     */
    role?: ERole;

    /**
     * groupIds
     * @class Group
     */
    groupIds?: string[];

    /**
     * friendIds
     * @class User
     */
    friendIds?: string[];

    /**
     * image src
     */
    imageSrc?: string;

    /**
     *
     */
    friendYouOweIds?: string[];

    /**
     *
     */
    friendWhoOweIds?: string[];

    /**
     *
     */
    groupYouOweIds?: string[];

    /**
     *
     */
    groupWhoOweIds?: string[];

    /**
     * tokenValidDate
     * @description token create date should be later than this, or it is invalid
     */
    tokenValidStartDate?: Date;
}

type TInput = UserComponent.IModel.IRequest.IUserC | UserComponent.IModel.IRequest.IUserU;

export class User extends IBase.BaseCollection<IUser> {
    protected _collectionName: string = User.name;

    /**
     * validate
     * @param input 
     */
    public static async validate(input: TInput): Promise<TInput> {
        try {
            Utility.validateRequiredEmpty('email', input);
            if (!Validator.isEmail(input.email)) {
                throw new Error('email format invalid');
            }

            Utility.validateRequiredEmpty('name', input);

            if (Utility.isKeyExist('gender', input)) {
                let validateValues: string[] = Utility.getEnumKeys(EGender);
                if (validateValues.indexOf(input.gender) === -1) {
                    throw new Error(`gender should be ${validateValues.join(', ')}`);
                }
            }

            if (Utility.isKeyExist('role', input)) {
                let validateValues: string[] = Utility.getEnumKeys(ERole);
                if (validateValues.indexOf(input.gender) === -1) {
                    throw new Error(`role should be ${validateValues.join(', ')}`);
                }
            }

            if (Utility.isKeyExist('groupIds', input)) {
                if (!Array.isArray(input.groupIds)) {
                    throw new Error(`groupIds should be an string array`);
                }
            }

            if (Utility.isKeyExist('friendIds', input)) {
                if (!Array.isArray(input.groupIds)) {
                    throw new Error(`friendIds should be an string array`);
                }
            }

            Utility.validateEmpty('imageBase64', input);

            if ('googleIdToken' in input) {
                Utility.validateRequiredEmpty('googleIdToken', input);
            } else if (!('id' in input) && !input.password) {
                throw new Error('googleIdToken and password can not both empty');
            }

            /// check repeat
            if (!('googleIdToken' in input)) {
                let excludeId: string = '';
                if ('id' in input) {
                    excludeId = input.id;
                }

                await Utility.checkRepeat('email', User.name, input, excludeId);
            }

            return input;
        } catch (error) {
            throw error;
        }
    }

    /**
     * parse
     * @param input 
     */
    public static parse(input: TInput): TInput {
        try {
            let innerInput = JSON.parse(JSON.stringify(input));

            return innerInput;
        } catch (error) {
            throw error;
        }
    }
}
