/**
 * A simple ping command for demonstration purposes.
 * @since February 20th, 2026
*/
import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};