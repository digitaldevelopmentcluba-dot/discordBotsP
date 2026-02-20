import { ShardingManager } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

export {
  manager
};