import { type Router } from "express";

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

  router.use((req, res) => {
    res.status(404).render(`invalid`, {
      title: `Invalid`,
      path: req.originalUrl
    });
  });
}

