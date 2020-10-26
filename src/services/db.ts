import { MongoClient, Db } from 'mongodb';

const ip: string = process.env.DB_IP;
const port: number = parseInt(process.env.DB_PORT);
const account: string = process.env.DB_ACCOUNT;
const password: string = process.env.DB_PASSWORD;
const dbName: string = process.env.DB_NAME;

class Service {
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
    private _dbClient: MongoClient = null;
    public get dbClient(): MongoClient {
        return this._dbClient;
    }

    /**
     *
     */
    private _database: Db = null;
    public get database(): Db {
        return this._database;
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
            this._dbClient = new MongoClient(this.baseUrl, {
                auth: {
                    user: account,
                    password: password,
                },
                useUnifiedTopology: true,
            });

            await this.dbClient.connect();

            this._database = this._dbClient.db(dbName);
        } catch (error) {
            throw error;
        }
    }
}

export const DbService = new Service();
