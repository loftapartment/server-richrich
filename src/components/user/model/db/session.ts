import { IBase } from '../../../base-model';

export enum ESessionType {
    general = 1,
    google
}
export interface ISession {
    /**
     * 
     */
    token: string;

    /**
     * user
     * @class User
     */
    userId: string;

    /**
     * 
     */
    sessionType: ESessionType;

    /**
     *
     */
    expiredDate: Date;
}

export class Session implements IBase.ICollection {
    /**
     * 
     */
    public get collectionName(): string {
        return Session.name;
    }

    /**
     * 
     * @param input 
     */
    public async validate(): Promise<void> {

    }
}








