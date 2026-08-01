import { MongoClient, Collection } from "mongodb";

export interface dataStoreValue {
    [key: string]: any;
}

export class dataStoreService {
    private client: MongoClient;
    private dbName: string;
    public db: any | null = null;

    constructor(uri: string, dbName: string) {
        this.client = new MongoClient(uri);
        this.dbName = dbName;
    }

    async connect(): Promise<void> {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
        }
    }

    getDataStore(name: string): dataStore {
        return new dataStore(this, name);
    }
}

export class dataStore {
    private service: dataStoreService;
    private name: string;

    constructor(service: dataStoreService, name: string) {
        this.service = service;
        this.name = name;
    }

    private async collection(): Promise<Collection> {
        await this.service.connect();
        return this.service.db.collection(this.name);
    }

    async getAsync<T = dataStoreValue>(key: string): Promise<T | null> {
        const col = await this.collection();
        const doc = await col.findOne({ key });
        return (doc?.value as T) ?? null;
    }

    async setAsync<T = dataStoreValue>(key: string, value: T): Promise<T> {
        const col = await this.collection();
        await col.updateOne(
            { key },
            { $set: { key, value } },
            { upsert: true }
        );
        return value;
    }

    async updateAsync<T = dataStoreValue>(
        key: string,
        callback: (oldValue: T | null) => T | Promise<T>
    ): Promise<T> {
        const col = await this.collection();

        const doc = await col.findOne({ key });
        const oldValue = (doc?.value as T) ?? null;

        const newValue = await callback(oldValue);

        await col.updateOne(
            { key },
            { $set: { key, value: newValue } },
            { upsert: true }
        );

        return newValue;
    }

    async removeAsync(key: string): Promise<void> {
        const col = await this.collection();
        await col.deleteOne({ key });
    }
}
