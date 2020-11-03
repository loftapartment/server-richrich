import mongoose from 'mongoose';

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
    private _dbClient: mongoose.Mongoose = null;
    public get dbClient(): mongoose.Mongoose {
        return this._dbClient;
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
            this._dbClient = await mongoose.connect(this.baseUrl, {
                auth: {
                    user: account,
                    password: password,
                },
                dbName: dbName,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (error) {
            throw error;
        }
    }
}

export const DbService = new Service();
