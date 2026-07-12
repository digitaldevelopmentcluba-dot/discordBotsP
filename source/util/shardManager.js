/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name shardManager.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description
*/
import { ShardingManager } from 'discord.js';
import { EventEmitter } from 'node:events';
import express, {Router} from 'express';

export default class shardManager extends EventEmitter {
    manager; web;
    #shards = [];

    static events = {
        router: `routerConnected`
    }

    constructor(path = `/`, token = process.env.token) {
        super();
        console.log(`⚙️ Constructed a new shard manager @ ${path}!`)
        let manager = new ShardingManager(path, {
            token: token,
            totalShards: 'auto',
            shardArgs: [
                token,
            ]
        });

        let router = this.web = Router();
        router.get(`/`, async (req, res) => {
            res.send(`The bot is currently active!`)
        })

        manager.on(`shardCreate`, (shard) => {
            this.#shards.push(shard);
            console.log(`🔹 Created shard ${shard.id}!`);

            shard.on(`message`, async (message) => {
                let {type, shardId} = message;
                switch (type) {
                    case `ping`: 
                        shard.send({
                            type: `pong`,
                            data: `You have been ponged!`
                        })
                        break;
                    default:
                        break;
                }
            })

            shard.on(`death`, () => {
                let newArray = [];
                this.#shards.forEach(function(s) {
                    if(s != shard) {
                        newArray.push(s);
                    }
                });
                this.#shards = newArray;
            })
        });

        this.manager = manager;
    }

    async init() {
        return await this.manager.spawn({timeout: -1});
    }

    get status() {
        return this.#shards.map(shard => ({
            id: shard.id,
            ready: shard.ready,
            pid: shard.process?.pid,
        }));
    }
}