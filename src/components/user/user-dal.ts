import { IBase } from '../base-model';
import { DbService } from '../../services'
import { Collection, FilterQuery, Cursor } from 'mongodb';
import { IModel } from './model';

export namespace UserDAL {
    /**
     * 
     */
    type TOutputR = IBase.MongoData<IModel.IUser>;

    function getCollection<T>(model: IBase.ICollection): Collection<T> {
        let db = DbService.db;
        return db.collection(model.collectionName);
    }

    /**
     * get all users
     */
    export async function getAllUsers(): Promise<TOutputR[]> {
        try {
            let collection: Collection<TOutputR> = getCollection<IModel.IUser>(new IModel.User);

            let count: number = await collection.find().count();
            let results: TOutputR[] = await collection
                .find()
                .limit(count)
                .toArray();

            return results;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     */
    export async function getUsers(src: Partial<IModel.IUser>): Promise<TOutputR[]>
    export async function getUsers(src: Partial<IModel.IUser>, options: IBase.IGetOptions<IModel.IUser>): Promise<TOutputR[]>
    export async function getUsers(src: Partial<IModel.IUser>, options?: IBase.IGetOptions<IModel.IUser>): Promise<TOutputR[]> {
        try {
            if (!options) {
                return getAllUsers();
            }

            let query: FilterQuery<IBase.MongoData<IModel.IUser>> = {};
            if (options.equals) {
                Object.keys(options.equals).forEach((key) => {
                    query[`${key}`] = {
                        $eq: src[key]
                    }
                })
            }

            if (options.notEquals) {
                Object.keys(options.equals).forEach((key) => {
                    query[`${key}`] = {
                        $ne: src[key]
                    }
                })
            }

            let collection = await getCollection<IModel.IUser>(new IModel.User);
            let cursor: Cursor = collection.find(query);

            let count: number = await collection.find(query).count();
            let results: TOutputR[] = await cursor
                .limit(count)
                .toArray();

            return results;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     */
    export async function signUpWithGoogle() {

    }
}
