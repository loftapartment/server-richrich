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
            let innerInput = JSON.parse(JSON.stringify(input));

            Utility.validateRequiredEmpty('email', innerInput);
            if (!Validator.isEmail(innerInput.email)) {
                throw new Error('email format invalid');
            }

            Utility.validateRequiredEmpty('name', input);

            if ('gender' in innerInput) {
                let validateValues: string[] = Utility.getEnumKeys(EGender);
                if (validateValues.indexOf(innerInput.gender) === -1) {
                    throw new Error(`gender should be ${validateValues.join(', ')}`);
                }
            }

            if ('role' in innerInput) {
                let validateValues: string[] = Utility.getEnumKeys(ERole);
                if (validateValues.indexOf(innerInput.gender) === -1) {
                    throw new Error(`role should be ${validateValues.join(', ')}`);
                }
            }

            if ('groupIds' in innerInput) {
                if (!Array.isArray(innerInput.groupIds)) {
                    throw new Error(`groupIds should be an string array`);
                }
            }

            if ('friendIds' in innerInput) {
                if (!Array.isArray(innerInput.groupIds)) {
                    throw new Error(`groupIds should be an string array`);
                }
            }

            Utility.validateEmpty('imageBase64', innerInput);

            if ('googleIdToken' in innerInput) {
                Utility.validateRequiredEmpty('googleIdToken', innerInput);
            } else if (!innerInput.password) {
                throw new Error('googleIdToken and password can not both empty');
            }

            /// check repeat
            let excludeId: string = '';
            if ('id' in innerInput) {
                excludeId = innerInput.id;
            }

            await Utility.checkRepeat('email', User.name, innerInput, excludeId);

            return innerInput;
        } catch (error) {
            throw error;
        }
    }
}
