import { UserComponent } from '.';
import { IBase } from '../base-model';
import { DbService } from '../../services'
import { Collection, FilterQuery, Cursor } from 'mongodb';

export namespace UserDAL {
    /**
     * 
     */
    type TOutputR = IBase.MongoData<UserComponent.IUser>;

    function getCollection<T>(model: IBase.ICollection): Collection<T> {
        let db = DbService.db;
        return db.collection(model.collectionName);
    }

    /**
     * get all users
     */
    export async function getAllUsers(): Promise<TOutputR[]> {
        try {
            let collection: Collection<TOutputR> = getCollection<UserComponent.IUser>(new UserComponent.User);

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
    export async function getUsers(src: Partial<UserComponent.IUser>): Promise<TOutputR[]>
    export async function getUsers(src: Partial<UserComponent.IUser>, options: IBase.IGetOptions<UserComponent.IUser>): Promise<TOutputR[]>
    export async function getUsers(src: Partial<UserComponent.IUser>, options?: IBase.IGetOptions<UserComponent.IUser>): Promise<TOutputR[]> {
        try {
            if (!options) {
                return getAllUsers();
            }

            let query: FilterQuery<IBase.MongoData<UserComponent.IUser>> = {};
            if (options.equals && options.equals.length > 0) {
                options.equals.forEach((key) => {
                    query[`${key}`] = {
                        $eq: src[key]
                    }
                })
            }

            if (options.notEquals && options.notEquals.length > 0) {
                options.notEquals.forEach((key) => {
                    query[`${key}`] = {
                        $ne: src[key]
                    }
                })
            }

            let collection = await getCollection<UserComponent.IUser>(new UserComponent.User);
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
