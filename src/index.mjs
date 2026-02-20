import { 
  Client, 
  GatewayIntentBits, Partials, Collection
} from 'discord.js';

import * as dotenv from 'dotenv'; 
import * as path from 'path';
import { importMany } from './utils/importMany.js';

import { fileURLToPath } from 'url'; 
import { dirname } from 'path';

dotenv.config();
const {token} = process.env;

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = await importMany(path.join(__dirname, 'commands'));
for await (const cmdModule of commands) {
    const command = cmdModule.default || cmdModule;
    client.commands.set(command.data.name, command);
}

await importMany(path.join(__dirname, 'events'), (module) => {
    const event = module.default || module;
    client.on(event.event, (...args) => event.execute(...args, client));
});

await client.login(token);
export default client;