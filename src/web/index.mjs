/**
 * This file controls the bot's custom web endpoint routing. Particularly useful for when retrieving information or controling the bot through an API once it is active.
 * @since February 20th, 2026
 */
import express from 'express';

export function createRouter(manager) {
  const router = express.Router();

  router.get('/status', async (req, res) => {
    const uptimesRaw = await manager.broadcastEval(client => client.uptime);
    const uptimes = uptimesRaw.filter((ms) => ms !== null);
    const formatted = uptimes.map(ms => ({
      shardUptimeMs: ms,
      shardUptimeSeconds: Math.floor(ms / 1000)
    }));
    const globalUptimeMs = uptimes.length ? Math.max(...uptimes) : 0;

    res.json({
      totalShards: manager.totalShards,
      shardIds: manager.shards.map(shard => shard.id),
      uptime: globalUptimeMs,
    });
  });

  return router;
}