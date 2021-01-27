import { IBase } from '../base-model';
import { DbService } from '../../services/db';
import { Collection, FilterQuery, Cursor } from 'mongodb';
import { IModel } from './model';

export namespace UserDAL {
    /**
     *
     */
    type TOutputR = IBase.MongoData<IModel.IUser>;

    function getCollection<T>(name: string): Collection<T> {
        let db = DbService.db;
        return db.collection(name);
    }

    /**
     * get all users
     */
    export async function getAllUsers(): Promise<TOutputR[]> {
        try {
            let collection: Collection<TOutputR> = getCollection<IModel.IUser>(IModel.User.name);

            let count: number = await collection.find().count();
            let results: TOutputR[] = await collection.find().limit(count).toArray();

            return results;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     */
    export async function getUsers(): Promise<TOutputR[]>;
    export async function getUsers(options: FilterQuery<TOutputR>): Promise<TOutputR[]>;
    export async function getUsers(options?: FilterQuery<TOutputR>): Promise<TOutputR[]> {
        try {
            if (!options) {
                return getAllUsers();
            }

            let query: FilterQuery<TOutputR> = options;

            let collection = await getCollection<IModel.IUser>(IModel.User.name);
            let cursor: Cursor = collection.find(query);

            let count: number = await collection.find(query).count();
            let results: TOutputR[] = await cursor.limit(count).toArray();

            return results;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     */
    export async function signUpWithGoogle() {}
}
