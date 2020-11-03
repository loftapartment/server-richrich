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
}
