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
    #status = new Map<number, any>();

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

        router.get(`/status`, async (req, res) => {
            const shardData = [];

            for (const shard of this.#shards) {
                const stats = this.#status.get(shard.id) ?? {};

                shardData.push({
                    id: shard.id,
                    ready: shard.ready,
                    guilds: stats.guilds ?? `Unknown`,
                    ping: stats.ping ?? `Unknown`,
                    uptime: stats.uptime ?? 0,
                    memory: stats.memory ?? {},
                    cpu: stats.cpu ?? {},
                    wsStatus: stats.wsStatus ?? `Unknown`,
                    lastHeartbeat: stats.lastHeartbeat ?? `Unknown`,
                    commandsRun: stats.commandsRun ?? 0,
                    messagesSeen: stats.messagesSeen ?? 0,
                    errors: stats.errors ?? 0,
                    warnings: stats.warnings ?? 0
                });
            }

            res.render(`status`, {
                title: `Bot Status`,
                shards: shardData,
                shardCount: shardData.length,
                totalGuilds: shardData.reduce((a, b) => a + (typeof b.guilds === `number` ? b.guilds : 0), 0)
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
                    case 'status':
                        if(message.data) {
                           this.#status.set(shard.id, message.data);
                        }
                        break;
                }
            })
        })
    }

    async init() {
        return await this.manager.spawn({timeout: -1});
    }
}
