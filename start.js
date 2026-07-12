/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name start.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description Start.js is the entry-point file for starting up the Discord bot. 
*/
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname, `./config/.env`)});

import util from '#util/index.js';
const { shardManager } = await util();

import express from 'express';
const app = express();

let manager = new shardManager(path.join(__dirname, `./source/bot.js`), process.env.token)
await manager.init();
app.use(manager.web); 

app.listen(port).addListener(`listening`, function() {
    console.log(`🌐 The app is now listening on port ${port}!`)
});

