import { 
  Client, 
  GatewayIntentBits, Partials, Collection, 
  SlashCommandBuilder, ChatInputCommandInteraction,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const token = process.env.token;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>;
    }
}

const client : Client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message, Partials.Channel, Partials.Reaction, 
        Partials.GuildMember, Partials.User, Partials.ThreadMember
    ],
});

import {commandBuilder} from '#utils/commandBuilder.js';
await commandBuilder.setClient(client);

let commands = path.join(__dirname, `./commands`);
for (let file of fs.readdirSync(commands)) {
    if (!file.endsWith(".js")) continue;
    let filePath = pathToFileURL(path.join(commands, file)).href;
    const { command } = await import(filePath);
    command.data = command.build();
    client.commands.set(command.name, command); 
}

let events = path.join(__dirname, `./events`);
for (const file of fs.readdirSync(events)) {
    if (!file.endsWith(".js")) continue;
    const filePath = pathToFileURL(path.join(events, file)).href;
    const module = await import(filePath);
    const event = module.default || module;
    client.on(event.event, (...args) => event.execute(...args, client));
}

await client.login(token);
export default client;