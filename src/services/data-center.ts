import { IBase } from '../../src/components/base-model';
import { Subject, BehaviorSubject } from 'rxjs';
import { concatMap, filter, take } from 'rxjs/operators';
import { Utility } from '../../src/helpers';
import { UserComponent } from '../../src/components';
import { DbService } from './db';

class Service {
    /**
     * 
     */
    private _ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public get ready$(): BehaviorSubject<boolean> {
        return this._ready$;
    }

    private _initiation$: Subject<any> = new Subject();

    /**
     * 
     */
    private _userIdTokenExpiredDateDict: IBase.IKeyValueObject<Date> = {};
    public get userIdTokenExpiredDateDict(): IBase.IKeyValueObject<Date> {
        return this._userIdTokenExpiredDateDict;
    }

    constructor() {
        DbService.ready$.pipe(
            filter(x => x === true),
            take(1),
            concatMap(async () => {
                this._initiation$.pipe(
                    concatMap(async () => {
                        try {
                            await this.initiation();

                            this.ready$.next(true);
                        } catch (error) {
                            console.error(error);

                            this.ready$.next(false);

                            await Utility.delay(10000);

                            this._initiation$.next();
                        }
                    })).subscribe();

                UserComponent.IModel.User.notice$.pipe(
                    concatMap(async (x) => {
                        if (x.method === 'c' || x.method === 'u' || x.method === 'd') {
                            await this.searchUserIdTokenExpiredDate();
                        }
                    })).subscribe();

                this._initiation$.next();
            })
        ).subscribe();
    }

    private async initiation(): Promise<void> {
        try {
            await this.searchUserIdTokenExpiredDate();
        } catch (error) {
            throw error;
        }
    }

    private async searchUserIdTokenExpiredDate(): Promise<void> {
        try {
            this._userIdTokenExpiredDateDict = {};
            let users = await UserComponent.UserController.getAllUserTokenExpiredDate();
            users.forEach((user) => {
                this._userIdTokenExpiredDateDict[user.id] = user.tokenValidStartDate;
            });
        } catch (error) {
            throw error;
        }
    }
}

export const DataCenter = new Service();