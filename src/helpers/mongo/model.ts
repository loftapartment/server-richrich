import { ObjectID } from 'mongodb';

export type MongoDoc<T> = {
    _id: ObjectID;
    _created_at: Date;
    _updated_at?: Date;
} & T;
