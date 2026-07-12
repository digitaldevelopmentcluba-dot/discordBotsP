/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name bot.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description
*/
import { 
  Client, 
  GatewayIntentBits, Partials, Collection, 
  SlashCommandBuilder, ChatInputCommandInteraction,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const token = process.argv.slice(2)[0];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
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

client.commands = new Collection();

let commands = path.join(__dirname, `./commands`);
for (let f of fs.readdirSync(commands)) {
    let file = pathToFileURL(path.join(commands, `/${f}`));
    const mod = (await import(file))
    let command = mod.default || mod; 
    let data = command.data ?? {name: `undefined`};
    client.commands.set(data.name, command);
}

let events = path.join(__dirname, `./events`);
for (let f of fs.readdirSync(events)) {
    let file = pathToFileURL(path.join(events, `/${f}`));
    const mod = (await import(file));
    let event = mod.default || mod; 
    client.on(event.event, (...args) => event.execute(...args, client));
}

process.on(`message`, message => {
    if (message.type === `pong`) {
        console.log(`Manager replied:`, message.data);
    }
});

await client.login(token);
export default client;