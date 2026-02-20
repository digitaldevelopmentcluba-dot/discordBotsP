/**
 * Sharding is something Discord has for bots that are in larger servers. Should the Digital Development Club be added into more servers, this would optimize the bot's performance by splitting its workload into several, smaller instances.
 * This file also just initalizes the bot instances.
 * @since February 20th, 2026
 */
import { ShardingManager } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRouter } from './web/index.mjs';

const {token} = process.env;
if (!token) throw new Error(`Warning: 'token' environmental variable is not set.`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manager = new ShardingManager(`${__dirname}/index.mjs`, {
  token: token,
  totalShards: 'auto',
});

manager.on('shardCreate', (shard) => {
  console.log(`Shard manager: Launching shard ${shard.id}`);
});

export default {
  manager,
  router: createRouter(manager),
};