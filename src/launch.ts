import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, `../config/.env`)});

let utils = pathToFileURL(path.join(__dirname, '/utils/index.js')).href;
let { shardManager } = await ((await import(utils)).default)();

import express from 'express';
const app = express();

let manager = new shardManager(path.join(__dirname, `./bot.js`), process.env.token);
await manager.init();
app.use(manager.web);


app.listen(process.env.port);