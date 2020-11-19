import { UserComponent } from '.';
import { IBase } from '../base-model';
import { DbService } from '../../services'
import { Collection } from 'mongodb';

export namespace UserDAL {
    /**
     * get all users
     */
    export async function getAllUsers(): Promise<IBase.MongoData<UserComponent.IUser>[]> {
        try {
            let db = DbService.db;
            let collectionName: string = UserComponent.IUser.name;
            let collection: Collection<IBase.MongoData<UserComponent.IUser>> = db.collection(collectionName);

            let count: number = await collection.find().count();
            let results: IBase.MongoData<UserComponent.IUser>[] = await collection
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
    export async function signUpWithGoogle() {

    }

    export interface IGetUsersOptions {
        equals: (keyof UserComponent.IUser)[];
        notEquals: (keyof UserComponent.IUser)[];
    }
}
