import { IModel } from "..";

export interface IUserBaseC {
    email: string;
    name: string;
    gender: keyof typeof IModel.EGender;
    role?: keyof typeof IModel.ERole;
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