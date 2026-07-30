import {commandBuilder} from '#utils/commandBuilder.js';
import type { Interaction, ChatInputCommandInteraction } from 'discord.js';

let command = new commandBuilder(`ping`, `Replies with pong!`, async function(interaction : ChatInputCommandInteraction) {
    let start = (Date.now());
    let message = await interaction.deferReply();
    message.edit({content: `🏓 Pong! (${(Date.now() - start)}ms)`});
});

export { command };
