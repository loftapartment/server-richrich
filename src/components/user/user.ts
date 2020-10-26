export interface IUser {
    /**
     * email
     * @description use email as account
     */
    email: string;

    /**
     *
     */
    password: string;

    /**
     * googleAuth
     * @description google oAuth
     */
    googleAuth: boolean;

    /**
     *
     */
    name: string;

    /**
     *
     */
    role: string;

    /**
     * groupIds
     * @class Group
     */
    groupIds: string[];

    /**
     * friendIds
     * @class User
     */
    friendIds: string[];

    /**
     * image src
     */
    imageSrc: string;
}
