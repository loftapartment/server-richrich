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
    export function validateEmpty(key: string, src: any): void {
        if (!src) {
            throw new Error('no any value');
        }

        if (typeof src === 'object') {
            if (key in src) {
                if (!src[key]) {
                    throw new Error(`${key} can not empty`);
                }
            }
        }
    }

    /**
     * 
     * @param key 
     * @param src 
     */
    export function validateRequiredEmpty(key: string, src: any): void {
        if (!src) {
            throw new Error('no any value');
        }

        if (typeof src === 'object') {
            if (!src[key]) {
                throw new Error(`${key} can not empty`);
            }
        }
    }

    /**
     * removeRebundant
     * @param data
     */
    export function removeRebundants<T>(data: T[]): T[] {
        try {
            if (!!data && typeof data !== 'object') {
                return data;
            }

            if (Array.isArray(data)) {
                data = data.map((item) => {
                    if (typeof item !== 'object') return item;
                    if (Array.isArray(item)) return item;

                    return removeRebundant(item);
                });
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param item 
     */
    export function removeRebundant<T>(item: T): T {
        let data: T = JSON.parse(JSON.stringify(item));
        let keys: string[] = Object.keys(data);
        keys.forEach((key) => {
            if (isNull(data[key])) delete data[key];
        });

        return data;
    }

    /**
     * get enum key
     * @description only get value is number's key
     */
    export function getEnumKeys(value: object): string[] {
        try {
            return Object.keys(value).filter(x => {
                let isValue: boolean = parseInt(x) >= 0;
                return !isValue;
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param data 
     * @param key 
     */
    export function isKeyExist(key: string, data: object): boolean {
        return key in data;
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
     * @param message 
     * @param statusCode 
     */
    export function getError(message: string, statusCode?: number): Error {
        let error = new Error(message);
        error['statusCode'] = statusCode || 500;
        return error;
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
