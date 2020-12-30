import { Collection, ObjectId } from 'mongodb';
import { DbService } from '../../../src/services/db';
import * as IResponse from './response';
export { IResponse };
import { Utility } from '../../../src/helpers';
import { Subject, Observable } from 'rxjs';

export interface IKeyValueObject<T> {
    [x: string]: T;
}

export type MongoData<T> = {
    _id?: ObjectId;
    _created_at?: Date;
    _updated_at?: Date;
} & T;

export interface IGetOptions<T> {
    equals?: Partial<T>;
    notEquals?: Partial<T>;
}

export interface INoticeCD<T> {
    name: string;
    method: 'c' | 'd';
    data: T;
}

export interface INoticeU<T> {
    name: string;
    method: 'u';
    prevData: T;
    data: T;
}

export type TNotice<T> = INoticeCD<T> | INoticeU<T>;

export class BaseCollection<T> {
    protected _id: string = undefined;
    public get id(): string {
        return this._id;
    }

    protected _collectionName: string = undefined;
    public get collectionName(): string {
        return this._collectionName;
    }

    protected static _notice$: Subject<TNotice<any>> = new Subject();
    public static get notice$(): Observable<TNotice<any>> {
        return this._notice$;
    }

    private _data: MongoData<T> = undefined;
    public get data(): MongoData<T> {
        return this._data;
    }
    public set data(value: MongoData<T>) {
        this._data = value;
    }

    private _innateData: MongoData<T> = undefined;

    constructor()
    constructor(id: string)
    constructor(id?: string) {
        this._id = id;
    }

    /**
     * save to db
     */
    public async save(): Promise<void> {
        try {
            this._data = Utility.removeRebundant(this._data);

            // create
            if (!this._id) {
                this._data._created_at = new Date();


                let result = await this.getCollection<T>(this.collectionName).insertOne(this._data as any);

                this._id = result.insertedId.toHexString();

                BaseCollection._notice$.next({
                    name: this.collectionName,
                    method: 'c',
                    data: JSON.parse(JSON.stringify(this.data))
                });
            } else {
                // update
                this._data._updated_at = new Date();

                let result = await this.getCollection<T>(this.collectionName).updateOne({
                    _id: {
                        $eq: this._data._id as any
                    }
                }, { $set: this._data });

                BaseCollection._notice$.next({
                    name: this.collectionName,
                    method: 'u',
                    prevData: this._innateData,
                    data: this._data
                });
            }

            this.setData(this._data);

        } catch (error) {
            throw error;
        }
    }

    /**
     * query from db
     */
    public async query(): Promise<void> {
        if (!this._id) {
            throw new Error('_id can not empty');
        }

        let result = await this.getCollection<T>(this.collectionName).findOne({ _id: new ObjectId(this._id) as any });
        this.setData(result);
    }

    /**
     * 
     * @param data 
     */
    public async queryByField(options: IGetOptions<T>): Promise<void> {
        try {
            let query: any = {};
            if (options.equals) {
                Object.keys(options.equals).forEach((key) => {
                    query[`${key}`] = {
                        $eq: options.equals[key]
                    }
                })
            }

            if (options.notEquals) {
                Object.keys(options.equals).forEach((key) => {
                    query[`${key}`] = {
                        $ne: options.notEquals[key]
                    }
                })
            }

            let result: MongoData<T> = await this.getCollection<T>(this.collectionName).findOne(query);

            if (!!result) {
                this.setData(result);

                this._id = result._id.toHexString();
            }

        } catch (error) {
            throw error;
        }
    }

    public async destroy(): Promise<void> {
        let result = await this.getCollection<T>(this.collectionName).deleteOne({ _id: new ObjectId(this._id) as any });

        BaseCollection._notice$.next({
            name: this.collectionName,
            method: 'd',
            data: this._data
        });
    }

    /**
     * 
     * @param name 
     */
    private getCollection<T>(name: string): Collection<MongoData<T>> {
        let db = DbService.db;
        return db.collection(name);
    }

    private setData(input: MongoData<T>) {
        this._data = input;
        this._innateData = JSON.parse(JSON.stringify(input));
    }
}

