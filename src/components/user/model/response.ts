import { IBase } from "components/base-model";
import { UserClass } from "../user";

export namespace IResponse {
    /**
     * 
     */
    export interface IUserR {
        id: string;
        email: UserClass['email'];
        name: UserClass['name'];
        role: string;
        groups: IBase.IResponse.IObject[];
        friends: IBase.IResponse.IObject[];
        imageSrc: string;
    }
}