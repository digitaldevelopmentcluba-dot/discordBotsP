import { Strategy } from 'passport-discord';
import passport from 'passport';
import type { Application } from 'express';

export function isLoggedIn(req : any, res : any, next : any) {
  if (req.isAuthenticated()) return next();
  res.redirect(`/discord/auth`);
}

export function getAvatarUrl(user) {
  if (!user.avatar) {
    const defaultAvatar = Number(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
  }

  const isGif = user.avatar.startsWith("a_");
  const ext = isGif ? "gif" : "png";

  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}`;
}

export function setupPassport(app : Application) {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new Strategy(
    {
      clientID: process.env.discordId!,
      clientSecret: process.env.discordSecret!,
      callbackURL: process.env.discordRedirect ?? `http://localhost:3000/discord/callback`,
      scope: [`identify`],
      passReqToCallback: false,
      authorizationURL: ``,
      tokenURL: ``
    },
    (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
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
}