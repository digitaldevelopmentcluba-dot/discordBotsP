/**
 * This is the starting file for the Digital Development Club's Discord bot.
 * @since February 20th, 2026 
 */

// Importing packages needed for webhosting 
import express, {urlencoded, json} from 'express';
import { createServer } from 'node:http';
const app = express(); // Creates the web application through express
const port = 3000; // The port for the web application
app.use(json()); // Allows for viewing JSON-based bodies in POST, PATCH, or DELETE requests
app.use(urlencoded({extended: false})); // Allows for viewing URL-based bodies in POST, PATCH, or DELETE requests

// Retrieves the bot's sharding manager and then attemps to spawn a few shards
const { manager, router } = await import('./src/sharding.mjs'); 
try {
  await manager.spawn(); // Spawns shards according to how many Discord servers the bot is in
  app.use(router); // Uses the bot's custom routing endpoints 
  console.log(`Spawned ${manager.totalShards} shards!`);
} catch (err) {
  console.error(`Failed to spawn shards:`, err);
}

app.get(`/`, async(req, res) => {
  res.status(200).json({code: 200, message: `OK`})
});

const server = createServer(app);
server.listen(port, function() {
  console.log(`Listening @ ${server.address()}:${port}`)
})