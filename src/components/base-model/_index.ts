import { Collection, ObjectId, UpdateQuery } from 'mongodb';
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

export type TData<T> = keyof ({
    _id?: ObjectId;
    _created_at?: Date;
    _updated_at?: Date;
} & T);

export interface IGetOptions<T> {
    equals?: Partial<T>;
    in?: Partial<T>;
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

    /**
     * for mongo used
     */
    private _data: MongoData<T> = undefined;

    private _innateData: MongoData<T> = undefined;

    private _updateQuery: UpdateQuery<MongoData<T>> = {};

    constructor() {}

    public setValue<U extends keyof MongoData<T>>(
        key: keyof MongoData<T>,
        value: MongoData<T>[U],
    ): this {
        this._data[`${key}`] = value;

        return this;
    }

    public getValue(key: TData<T>): any {
        return this._data[`${key}`];
    }

    public unset(key: keyof MongoData<T>): this {
        if (!this._updateQuery.$unset) {
            this._updateQuery.$unset = {};
        }

        (this._updateQuery['$unset'] as any)[`${key}`] = null;

        delete this._data[key];

        return this;
    }

    /**
     * save to db
     */
    public async save(needNotice?: boolean): Promise<void> {
        needNotice = Utility.isNull(needNotice) ? true : needNotice;

        try {
            this._data = Utility.removeRebundant(this._data);

            // create
            if (!this._id) {
                this._data._created_at = new Date();

                let result = await this.getCollection<T>(this.collectionName).insertOne(
                    this._data as any,
                );

                this._data._id = result.insertedId;

                if (needNotice) {
                    BaseCollection._notice$.next({
                        name: this.collectionName,
                        method: 'c',
                        data: JSON.parse(JSON.stringify(this._data)),
                    });
                }
            } else {
                this._data._updated_at = new Date();

                delete this._data._id;

                this._updateQuery.$set = this._data;

                let result = await this.getCollection<T>(this.collectionName).updateOne(
                    {
                        _id: {
                            $eq: new ObjectId(this._id) as any,
                        },
                    },
                    this._updateQuery,
                );

                this._data._id = new ObjectId(this._id);

                if (needNotice) {
                    BaseCollection._notice$.next({
                        name: this.collectionName,
                        method: 'u',
                        prevData: this._innateData,
                        data: this._data,
                    });
                }
            }

            this._updateQuery = {};

            this.setData(this._data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * query from db
     */
    public async query(id: string): Promise<this> {
        if (!id) {
            throw new Error('id can not empty');
        }

        let result = await this.getCollection<T>(this.collectionName).findOne({
            _id: new ObjectId(id) as any,
        });

        this.initiation();

        if (!result) return undefined;

        this.setData(result);

        return this;
    }

    /**
     *
     * @param data
     */
    public async queryByField(options: IGetOptions<T>): Promise<this> {
        try {
            let query: any = {};
            if (options.equals) {
                Object.keys(options.equals).forEach((key) => {
                    query[`${key}`] = {
                        $eq: options.equals[key],
                    };
                });
            }

            if (options.notEquals) {
                Object.keys(options.equals).forEach((key) => {
                    query[`${key}`] = {
                        $ne: options.notEquals[key],
                    };
                });
            }

            let result: MongoData<T> = await this.getCollection<T>(this.collectionName).findOne(
                query,
            );

            this.initiation();

            if (!result) return undefined;

            this.setData(result);
            return this;
        } catch (error) {
            throw error;
        }
    }

    public async destroy(): Promise<void> {
        let result = await this.getCollection<T>(this.collectionName).deleteOne({
            _id: new ObjectId(this._id) as any,
        });

        BaseCollection._notice$.next({
            name: this.collectionName,
            method: 'd',
            data: this._data,
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

    private initiation(): void {
        this._id = undefined;
        this._data = undefined;
        this._innateData = undefined;
        this._updateQuery = {};
    }

    private setData(input: MongoData<T>) {
        this._id = input._id.toHexString();
        this._data = input;
        this._innateData = JSON.parse(JSON.stringify(input));
    }
}
