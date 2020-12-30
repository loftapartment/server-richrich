import { IModel } from "..";

export type TGender = keyof typeof IModel.EGender;

export interface IUserBaseC {
    email: string;
    name: string;
    gender?: TGender;
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

export interface IUserProfile {
    name: string;
    gender?: TGender;
    groupIds?: string[];
    friendIds?: string[];
    imageBase64?: string;
}

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