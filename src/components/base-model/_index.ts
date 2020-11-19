import { ObjectId } from 'mongodb';

export type MongoData<T> = {
    _id?: ObjectId;
    _created_at?: Date;
    _updated_at?: Date;
} & T;

export interface IGetOptions<T> {
    equals?: (keyof T)[];
    notEquals?: (keyof T)[];
}

export interface ICollection {
    readonly collectionName: string;
    validate: Function;
}

import * as IResponse from './response';

export { IResponse };

