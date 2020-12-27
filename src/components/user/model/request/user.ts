import { IModel } from "..";

export interface IUserBaseC {
    email: string;
    name: string;
    gender?: keyof typeof IModel.EGender;
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

export interface IUserGeneralU extends IUserGeneralC {
    id: string;
}

export interface IUserGoogleU extends IUserGoogleC {
    id: string;
}

export type IUserU = IUserGeneralU | IUserGoogleU;

export interface ILoginBasic {
    email: string;
    password: string;
}

export interface ILoginGoogle {
    googleIdToken: string;
}

export interface ILoginSession {
    session: string;
}

export type ILogin = ILoginBasic | ILoginGoogle | ILoginSession;