import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname, `../config/.env`)});

let utils = pathToFileURL(path.join(__dirname, `/utils/index.js`)).href;
let { shardManager } = await ((await import(utils)).default)();

import express from 'express';
import expressLayouts from 'express-ejs-layouts';

const app = express();
app.set(`view engine`, `ejs`);
app.set(`views`, path.join(process.cwd(), `src`, `web`, `views`));

app.use(expressLayouts);
app.set(`layout`, `layouts/main`);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(path.join(process.cwd(), `src`, `web`, 'public')));

import session from 'express-session';
import { Strategy } from "passport-discord";
import passport from 'passport'


function isLoggedIn(req : any, res : any, next : any) {
  if (req.isAuthenticated()) return next();
  res.redirect('/discord/auth');
}

app.use(session({
  secret: process.env.sessionSecret as any,
  resave: false,
  saveUninitialized: false
}));

app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy(
  {
    clientID: process.env.discordId!,
    clientSecret: process.env.discordSecret!,
    callbackURL: process.env.discordRedirect ?? "http://localhost:3000/discord/callback",
    scope: ["identify"],
    passReqToCallback: false,
    authorizationURL: "",
    tokenURL: "",
  },
  (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    return done(null, profile);
  }
));

passport.serializeUser((user : any, done : any) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done : any) => {
  done(null, obj);
});

app.get(`/discord/auth`, passport.authenticate(`discord`));
app.get(
  `/discord/callback`,
  passport.authenticate(`discord`, {failureRedirect: `/`}),
  (req, res) => {
    res.redirect(`/`);
  }
);

app.get(`/logout`, (req, res) => {
  req.logout(() => {
    res.redirect(`/`);
  });
});

let manager = new shardManager(path.join(__dirname, `./bot.js`), process.env.token);
await manager.init();
app.use(manager.web);

app.listen(process.env.port);