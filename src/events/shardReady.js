/**
 * Indicates that a shard has been successfully launched with no issues.
 * @since February 20th, 2026
 */
import { Events, Shard } from 'discord.js';

export default {
  event: Events.ShardReady,
  async execute(shardId) {
    console.log(`Shard ${shardId} has been launched!`);
  },
};