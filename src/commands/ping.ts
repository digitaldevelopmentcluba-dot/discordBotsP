import {commandBuilder} from '#utils/commands/commandBuilder.js';
import { type Interaction, type ChatInputCommandInteraction, type ActionRow, MessageFlags, ActionRowBuilder } from 'discord.js';
import { buttonBuilder } from '#utils/components/components.js';

let command = new commandBuilder(`ping`, `Pings the bot!`, async function(interaction : ChatInputCommandInteraction) {
    let start = (Date.now());
    let message = await interaction.deferReply();
    message.edit({content: `🏓 Pong! (${(Date.now() - start)}ms)`});
});

export { command };
