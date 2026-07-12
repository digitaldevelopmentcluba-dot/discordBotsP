/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name shardReady.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description
*/
import { Events, Shard } from 'discord.js';

export default {
  event: Events.ShardReady,
  async execute(shardId) {
    console.log(`🔷 Shard ${shardId} is now ready!`);
  },
};