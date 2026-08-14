import { Shard, ShardingManager } from 'discord.js';
import { EventEmitter } from 'node:events';
import { Router } from 'express';

export default class shardManager extends EventEmitter {
    manager : ShardingManager; web : Router;
    shards : Shard[] = [];
    status = new Map<number, any>();

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
        import(`#web/router.js`).then(result => {
            const {setupRouter} = result;
            setupRouter(router, this)
        });

        manager.on(`shardCreate`, (shard) => {
            this.shards.push(shard);

            shard.on(`message`, async (message) => {
                let {type, shardId} = message;
                switch (type) {
                    case `ping`:
                        shard.send({type: `pong`, data: `You have been ponged!`});
                        break;
                    case 'status':
                        if(message.data) {
                           this.status.set(shard.id, message.data);
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