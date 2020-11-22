import { ObjectId } from 'mongodb';

export type MongoData<T> = {
    _id?: ObjectId;
    _created_at?: Date;
    _updated_at?: Date;
} & T;

export interface IGetOptions<T> {
    equals?: Partial<T>;
    notEquals?: Partial<T>;
}

export interface ICollection {
    readonly collectionName: string;
    validate: Function;
}

import * as IResponse from './response';

export { IResponse };

