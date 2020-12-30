import { MongoClient, Db } from 'mongodb';
import { BehaviorSubject } from 'rxjs';

const ip: string = process.env.DB_IP;
const port: number = parseInt(process.env.DB_PORT);
const account: string = process.env.DB_ACCOUNT;
const password: string = process.env.DB_PASSWORD;
const dbName: string = process.env.DB_NAME;

class Service {
    /**
     * 
     */
    private _ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public get ready$(): BehaviorSubject<boolean> {
        return this._ready$;
    }

    /**
     *
     */
    private _baseUrl: string = '';
    public get baseUrl(): string {
        return this._baseUrl;
    }

    /**
     *
     */
    private _db: Db = null;
    public get db(): Db {
        return this._db;
    }

    constructor() {
        this._baseUrl = `mongodb://${ip}:${port}`;
    }

    /**
     * connect
     * @description connect MongoDB with config
     */
    public async connect() {
        try {
            let client = new MongoClient(this.baseUrl, {
                auth: {
                    user: account,
                    password: password,
                },
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            await client.connect();

            this._db = client.db(dbName);

            this.ready$.next(true);
        } catch (error) {
            throw error;
        }
    }
}

export const DbService = new Service();
