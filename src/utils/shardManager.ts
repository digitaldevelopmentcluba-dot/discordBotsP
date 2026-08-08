import { Shard, ShardingManager } from 'discord.js';
import { EventEmitter } from 'node:events';
import express, {Router, type Application} from 'express';

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
        router.get("/", (req, res) => {
		res.send("Hello hi yes funny website landing page oh no this is temporary")
	})


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
