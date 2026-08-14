import { type Router } from "express";
import crypto from "crypto";
import { addNewsPost, getNewsPostById, getAllNewsPosts, validateNewsPost } from "#utils/core/news.js"
import { isLoggedIn, getAvatarUrl } from "#utils/core/passport.js"
import type shardManager from "#utils/core/shardManager.js"

export function extractSummary(content : any) {
  if (!content || typeof content !== `string`) return ``;

  const text = content.toString().trim();
  const match = text.match(/[.!?]/);

  if (match) {
    const index : any = match.index;
    return text.substring(0, index + 1);
  }

  return text.substring(0, 160);
}

export function setupRouter(router: Router, self: shardManager) {
  let start = new Date();

  router.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });

  router.get(`/`, (req, res) => {
    res.render(`index`, {
      title: `Home`,
      summary: `Welcome to the Digital Development Club!`,
      elapsed: (new Date() as any) - (start as any),
    });
  });

  router.get(`/about`, (req, res) => {
    res.render(`about`, {
      title: `About`,
      summary: `Want to know what the Digital Development Club is about? This is the page to get that information!`,
    });
  });

  router.get(`/status`, async (req, res) => {
    const shardData = [];

    for (const shard of self.shards) {
      const stats = self.status.get(shard.id) ?? {};

      shardData.push({
        id: shard.id,
        ready: shard.ready,
        guilds: stats.guilds ?? `Unknown`,
        ping: stats.ping ?? `Unknown`,
        uptime: stats.uptime ?? 0,
        memory: stats.memory ?? {},
        cpu: stats.cpu ?? {},
        wsStatus: stats.wsStatus ?? `Unknown`,
        lastHeartbeat: stats.lastHeartbeat ?? `Unknown`,
        commandsRun: stats.commandsRun ?? 0,
        messagesSeen: stats.messagesSeen ?? 0,
        errors: stats.errors ?? 0,
        warnings: stats.warnings ?? 0
      });
    }

    res.render(`status`, {
      title: `Bot Status`,
      summary: `A super-secret page for retrieving Discord bot status information.`,
      shards: shardData,
      shardCount: shardData.length,
      totalGuilds: shardData.reduce((a, b) => a + (typeof b.guilds === `number` ? b.guilds : 0), 0)
    });
  });

  router.get(`/coc`, async (req, res) => {
    res.redirect(`assets/documents/coc.pdf`);
  });

  router.get(`/bylaws`, async (req, res) => {
    res.redirect(`assets/documents/cab.pdf`);
  });

  router.get(`/news`, async (req, res) => {
    const posts = await getAllNewsPosts();
    res.render(`news`, {
      title: `News`,
      summary: `This page consists of the many news articles that the Digital Development Club has published!`,
      posts
    });
  });

  router.get(`/news/:id`, async (req, res) => {
    const id = req.params.id;
    const post = await getNewsPostById(id);

    if (!post) {
      return res.status(404).render(`invalid`, {
        title: `Post Not Found`,
        path: req.originalUrl
      });
    }

    res.render(`post`, {
      title: post.title,
      summary: post.content ?? `No content was provided.`,
      post
    });
  });

  router.post(`/news`, isLoggedIn, async (req, res) => {
    const validation = validateNewsPost(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        error: `Invalid request body`,
        details: validation.errors
      });
    }

    const { title, summary, tags, thumbnail, content } = req.body;
    const id = crypto.randomUUID();
    let formattedTags = (req.body.tags ? req.body.tags.split(`,`).map((t : any) => t.trim()).filter((t : any) => t.length > 0) : []);
    
    const user : any = req.user;
    const approvedUsers = [`1222647770788397168`, `210179841817837569`, `1410689274344509541`]

    if(!approvedUsers.includes(user.id.toString())) return res.redirect(`/news`);

    await addNewsPost({
      id,
      title,
      summary: extractSummary(content),
      authorThumb: getAvatarUrl(user),
      date: new Date(),
      author: user.username,
      tags: formattedTags ?? [],
      thumbnail,
      content
    });

    res.redirect(`/news/${id}`);
  });

  router.use((req, res, next) => {
    res.render(`invalid`, {
      title: `Invalid Page`,
      summary: `This is an invalid page! It does not exist within the Digital Development Club.`
    })
    next();
  });
}