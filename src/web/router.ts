import { type Router } from "express";
import crypto from "crypto";
import { addNewsPost, getNewsPostById, getAllNewsPosts, validateNewsPost } from "#utils/core/news.js"
import { isLoggedIn } from "#utils/core/passport.js"

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

export function setupRouter(router: Router, self?: any) {
  let start = new Date();

  router.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });

  router.get(`/`, (req, res) => {
    res.render(`index`, {
      title: `Home`,
      elapsed: (new Date() as any) - (start as any),
    });
  });

  router.get(`/about`, (req, res) => {
    res.render(`about`, {
      title: `About`,
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
      shards: shardData,
      shardCount: shardData.length,
      totalGuilds: shardData.reduce((a, b) => a + (typeof b.guilds === `number` ? b.guilds : 0), 0)
    });
  });

  router.get(`/coc`, async (req, res) => {
    res.redirect(`assets/CodeOfConduct.pdf`);
  });

  router.get(`/bylaws`, async (req, res) => {
    res.redirect(`assets/ConstitutionAndBylaws.pdf`);
  });

  router.get(`/news`, async (req, res) => {
    const posts = await getAllNewsPosts();
    res.render(`news`, {
      title: `News`,
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
      post
    });
  });

  router.post(`/news`, isLoggedIn, async (req, res) => {
    const validation = validateNewsPost(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        error: "Invalid request body",
        details: validation.errors
      });
    }

    const { title, summary, tags, thumbnail, content } = req.body;
    const id = crypto.randomUUID();
    let formattedTags = (req.body.tags ? req.body.tags.split(",").map((t : any) => t.trim()).filter((t : any) => t.length > 0) : []);
    
    const user : any = req.user;
    console.log(user)

    await addNewsPost({
      id,
      title,
      summary: extractSummary(content),
      authorThumb: user.avatar,
      date: new Date(),
      author: user.username,
      tags: formattedTags ?? [],
      thumbnail,
      content
    });

    res.redirect(`/news/${id}`);
  });
}