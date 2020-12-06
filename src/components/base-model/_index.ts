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

export class BaseCollection<T> {
    private _id: string = undefined;
    public get(): string {
        return this._id;
    }

    private _data: T = undefined;
    public get data(): T {
        return this._data;
    }
    public set data(value: T) {
        this._data = value;
    }

    constructor(data: T) {
        this._data = data;
    }

    /**
     * save to db
     */
    public save() {

    }

    /**
     * query from db
     */
    public query() {
        if (!this._id) {
            throw new Error('_id can not empty');
        }
    }
}

import * as IResponse from './response';

export { IResponse };

