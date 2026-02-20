import express from 'express';
import { create } from 'node:domain';
import { createServer } from 'node:http';
const app = express();

const { manager } = await import('./src/sharding.mjs'); 

try {
  await manager.spawn();
  console.log(`Start: Spawned shards`);
} catch (err) {
  console.error(`Start: Failed to spawn shards:`, err);
}

app.get(`/`, async(req, res) => {
  res.status(200).json({code: 200, message: `OK`})
});

const port = 3000;
const server = createServer(app);
server.listen(port, function() {
  console.log(`Listening @ ${server.address()}:${port}`)
})