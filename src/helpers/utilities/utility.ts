import { IUser } from "components";
import { DbService } from "../../services";

export namespace Utility {
    /**
     * kill this process
     */
    export function killServer(): void {
        process.exit(0);
    }

    /**
     * isNull
     * @description check whether data is null or undefined
     * @param data 
     */
    export function isNull(data: any): boolean {
        return data === null || data === undefined;
    }

    /**
     * 
     * @param key 
     * @param src 
     */
    export function validateEmpty(key: string, src: any): void
    export function validateEmpty(key: string, src: any, isRequired: boolean): void
    export function validateEmpty(key: string, src: any, isRequired?: boolean): void {
        if (!src) {
            throw new Error('no any value');
        }

        if (typeof src === 'object') {
            if (isRequired) {
                if (!src[key]) {
                    throw new Error(`${key} can not empty`);
                }
            } else if (key in src) {
                if (!src[key]) {
                    throw new Error(`${key} can not empty`);
                }
            }
        }
    }

    /**
     * removeRebundant
     * @param data
     */
    export function removeRebundant<T>(data: T[]): T[] {
        try {
            if (!!data && typeof data !== 'object') {
                return data;
            }

            if (Array.isArray(data)) {
                data = data.map((item) => {
                    if (typeof item !== 'object') return item;
                    if (Array.isArray(item)) return item;

                    let keys: string[] = Object.keys(item);
                    keys.forEach((key) => {
                        if (isNull(item[key])) delete item[key];
                    });

                    return item;
                });
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * get enum key
     * @description only get value is number's key
     */
    export function getEnumKeys(value: object): string[] {
        try {
            return Object.keys(value).filter(x => typeof x === 'string');
        } catch (error) {
            throw error;
        }
    }

    /**
     * parse date from json
     */
    export function parseDate(value: any): Date {
        try {
            let date: Date = new Date(value);
            if (date.toString() === 'Invalid Date') {
                return undefined;
            }
            return date;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * checkRepeat
     * @param key 
     * @param collectionName 
     */
    export async function checkRepeat<T>(key: string, collectionName: string, input: T): Promise<void>
    export async function checkRepeat<T>(key: string, collectionName: string, input: T, excludeId: string): Promise<void>
    export async function checkRepeat<T>(key: string, collectionName: string, input: T, excludeId?: string): Promise<void> {
        try {
            let db = DbService.db;
            let collection = db.collection(collectionName);

            let data = await collection.findOne({
                [key]: input[key],
                _id: {
                    $ne: excludeId
                }
            });

            if (!!data) {
                throw new Error(`${key} '${input[key]}' already exist`);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param error 
     */
    export function handleError(error: any): string {
        if (error instanceof Error) {
            return error.message;
        }

        if (typeof error === 'string') {
            return error;
        }

        return JSON.stringify(error);
    }
}
