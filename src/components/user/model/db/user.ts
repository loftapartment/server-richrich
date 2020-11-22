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

export class User implements IBase.ICollection {
    /**
     * 
     */
    public get collectionName(): string {
        return User.name;
    }

    /**
     * 
     * @param input 
     */
    public async validate(input: UserComponent.IModel.IRequest.IUserC | UserComponent.IModel.IRequest.IUserU): Promise<UserComponent.IModel.IRequest.IUserC | UserComponent.IModel.IRequest.IUserU> {
        try {
            let innerInput = JSON.parse(JSON.stringify(input));

            Utility.validateEmpty('email', innerInput, true);
            if (!Validator.isEmail(innerInput.email)) {
                throw new Error('email format invalid');
            }

            Utility.validateEmpty('name', input, true);

            if ('gender' in innerInput) {
                let validateValues: string[] = Utility.getEnumKeys(EGender);
                if (validateValues.indexOf(innerInput.gender) === -1) {
                    throw new Error(`gender should be 'male' or 'female'`);
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
                Utility.validateEmpty('googleIdToken', innerInput, true);
            } else if (!innerInput.password) {
                throw new Error('googleIdToken and password can not both empty');
            }

            /// check repeat
            let excludeId: string = '';
            if ('id' in innerInput) {
                excludeId = innerInput.id;
            }

            await Utility.checkRepeat('email', this.collectionName, innerInput, excludeId);

            return innerInput;
        } catch (error) {
            throw error;
        }
    }
}
