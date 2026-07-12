/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name ping.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description
*/
import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		let start = new Date();
		let reply = await interaction.deferReply({ephemeral: true});
		await reply.edit({content: `🏓 Pong! (${((new Date()) - start) / 1000}s)`})
	},
};