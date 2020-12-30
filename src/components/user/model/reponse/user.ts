import { IBase } from "src/components/base-model";
import { IUser } from "../db";

/**
* 
*/
export interface IUserR {
    id: string;
    email: IUser['email'];
    name: IUser['name'];
    gender: string;
    role: string;
    groups: IBase.IResponse.IObject[];
    friends: IBase.IResponse.IObject[];
    imageSrc: string;
    googleAuth: boolean;
}

export interface IUserTokenExpiredDate {
    id: string;
    tokenValidStartDate: Date;
}