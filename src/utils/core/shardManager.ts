/*
 ____  ____   ___ 
(    \(    \ / __)
 ) D ( ) D (( (__ 
(____/(____/ \___)
/**
 * @name shardManager.ts
 * @author(s) Breezist
 * @since August 13th, 2026
 * @description The purpose of shardManager.ts is to separate Discord bot processes into several "shards." These shards act as a fail-safe for in-case if something errors. Each shard could then be hot-restarted. The shardManager also manages web routing for Discord purposes. 
 */

import { Shard, ShardingManager } from 'discord.js';
import { EventEmitter } from 'node:events';
import express, {Router, type Application} from 'express';

export default class shardManager extends EventEmitter {
    manager : ShardingManager; web : Router;
    shards : Shard[] = [];
    status = new Map<number, any>();

    /**
     * Constructs a new shardManager instance.
     * @param path - The path of the Discord bot file. (for our case it would be ./bot.js) 
     * @param token - The bot's Discord token as generated @ https://www.discord.com/developers/applications.
     */
    constructor(path = `/`!, token = process.env.token!) {
        super();

        // Shards configuration
        let manager = this.manager = new ShardingManager(path, {
            token: token,
            totalShards: 'auto',
            shardArgs: [
                token,
            ]
        });

        // Routing management
        let router = this.web = Router();
        import(`#web/router.js`).then(result => {
            const {setupRouter} = result;
            setupRouter(router, this)
        });

        /**
         * Executes when a new shard is created.
         */
        manager.on(`shardCreate`, (shard) => {
            this.shards.push(shard);
            
            /**
             * IPC messaging. Executes when process.send is called within the bot.js file (or really any bot-related file).  
             */
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