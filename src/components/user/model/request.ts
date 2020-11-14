export namespace IRequest {
    export interface IUserBaseC {
        email: string;
        name: string;
        groupIds?: string[];
        friendIds?: string[];
        imageBase64?: string;
    }

    export interface IUserGeneralC extends IUserBaseC {
        password: string;
    }

    export interface IUserGoogleC extends IUserBaseC {
        googleIdToken: string;
    }

    export type IUserC = IUserGeneralC | IUserGoogleC;
}