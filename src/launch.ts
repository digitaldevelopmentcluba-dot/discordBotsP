import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.join(__dirname, `../config/.env`)});

const {core: {shardManager, passport: { setupPassport }, globals: { setupGlobals }}} = await import(`#utils/index.js`).then(module => module.default());
await setupGlobals();

import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';

const app = express();
const webRoot = path.join(process.cwd(), `src`, `web`);

Object.entries({
  'view engine': `ejs`,
  views: path.join(webRoot, `views/pages`),
  layout: path.join(webRoot, `views/layouts/main`),
  'trust proxy': 1
}).forEach(([key, value]) => app.set(key, value));

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(webRoot, `public`)));

app.use(session({
  secret: process.env.sessionSecret as any,
  resave: false,
  saveUninitialized: false
}));

setupPassport(app); 

let manager = new shardManager(path.join(__dirname, `./bot.js`), process.env.token);
await manager.init();
app.use(manager.web);

app.listen(process.env.port);