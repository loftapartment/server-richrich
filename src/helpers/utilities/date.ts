export namespace DateService {
    export function isExpiredMs(ms: number): boolean {
        return isFirstLater({
            first: new Date(),
            second: new Date(ms)
        });
    }

    export function isExpired(date: Date): boolean {
        return isFirstLater({
            first: new Date(),
            second: date
        });
    }

    export function isFirstLater(options: { first: Date; second: Date; }): boolean {
        return options.first.getTime() > options.second.getTime();
    }
}