# Introduction 
This repository houses the code for the [Digital Development Club website](https://www.digitaldevelopment.club/) as well as the club Discord bot. The goal is to provide a singular place for the club's Discord and web needs.

# Installation
1. Install [Git](https://git-scm.com/install/)
2. Install [Node.js v18.20.4](https://nodejs.org/en/download/current) or above.
3. Use the following Git command to clone the repository. Alternatively, you could download the source code directly.
```
git clone git@github.com:digitaldevelopmentcluba-dot/discordBotsP.git
```
4. ``cd`` into the source directory.
5. Install the dependencies:
```bat
npm install
```
6. The following environment variables must be created in ``discordBotsP/config`` inside of ``.env``:
```env
token=
mongo=
discordSecret=
sessionSecret=
discordRedirect=
port=8080
```
7. Run ``npm run build``
8. Run ``npm run start``

# Features
* Discord bot hosting through ``discord.js``.
* Multi-instance sharding support
* IPC messaging
* Website hosting through ``express.js``.
* Layout and templating through ``ejs``.
* Static file handling.

# Compatibility
In production, the following tools were used:
```
Node v18.20.4
npm 9.2.0
```

# License
This repository is under the [Apache 2.0 License](https://github.com/digitaldevelopmentcluba-dot/discordBotsP/tree/main?tab=License-1-ov-file).
