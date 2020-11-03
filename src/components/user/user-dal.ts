import { IUser } from '.';
import { DocumentType } from '@typegoose/typegoose';

export namespace UserDAL {
    /**
     *
     */
    export async function getAllUsers(): Promise<DocumentType<IUser.UserClass>[]> {
        try {
            let count: number = await IUser.User.find().countDocuments();
            let results: DocumentType<IUser.UserClass>[] = await IUser.User.find().limit(count);

            return results;
        } catch (error) {
            throw error;
        }
    }
}
