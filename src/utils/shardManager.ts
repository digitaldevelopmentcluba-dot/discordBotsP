import { Shard, ShardingManager } from 'discord.js';
import { EventEmitter } from 'node:events';
import express, {Router, type Application} from 'express';
import { dataStore, dataStoreService } from "#utils/database.js";

declare global {
    var datastoreService: dataStoreService;
    var datastore: dataStore;
}

const datastoreService = global.datastoreService = new dataStoreService(process.env.mongo ? process.env.mongo : ``, `ddc`);
await datastoreService.connect();
const datastore = global.datastore = datastoreService.getDataStore(`main`);

export default class shardManager extends EventEmitter {
    manager : ShardingManager; web : Router;
    #shards : Shard[] = [];

    constructor(path = `/`!, token = process.env.token!) {
        super();

        let manager = this.manager = new ShardingManager(path, {
            token: token,
            totalShards: 'auto',
            shardArgs: [
                token,
            ]
        });
        let router = this.web = Router();
        let start = new Date();

        router.get(`/`, (req, res) => {
            res.render(`index`, { 
                title: `Home`,
                elapsed: (new Date() as any) - (start as any),
            });
        });

        router.get(`/about`, (req, res) => {
            res.render(`about`, { 
                title: `About`,
            });
        });

        router.use((req, res) => {
            res.status(404).render(`invalid`, {
                title: `Invalid`,
                path: req.originalUrl
            });
        });

        manager.on(`shardCreate`, (shard) => {
            this.#shards.push(shard);
            shard.on(`message`, async (message) => {
                let {type, shardId} = message;
                switch (type) {
                    case `ping`:
                        shard.send({type: `pong`, data: `You have been ponged!`});
                        break;
                }
            })
        })
    }

    async init() {
        return await this.manager.spawn({timeout: -1});
    }
}
