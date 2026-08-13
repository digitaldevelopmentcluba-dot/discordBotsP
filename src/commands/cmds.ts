import {commandBuilder} from '#utils/commands/commandBuilder.js';
import { type Interaction, type ChatInputCommandInteraction, type ActionRow, MessageFlags, ActionRowBuilder, EmbedBuilder, ButtonInteraction } from 'discord.js';
import { buttonBuilder } from '#utils/components/components.js';

import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageSize = 5;

let command = new commandBuilder(
    `cmds`, `Sends a list of available commands!`,
    async function (interaction: ChatInputCommandInteraction) {
        const message = await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
        });

        const commandsPath = path.join(__dirname, `./`);
        const files = fs.readdirSync(commandsPath);

        const commands: { name: string; description: string }[] = [];

        for (const file of files) {
            if (!file.endsWith(`.js`)) continue;

            const fullPath = path.join(commandsPath, file);
            const fileUrl = pathToFileURL(fullPath).href;

            const imported = await import(fileUrl);
            const cmd = imported.default || imported.command;
            if (!cmd) continue;

            commands.push({
                name: cmd.data?.name || cmd.name || file.replace(`.js`, ``),
                description: cmd.data?.description || cmd.description || `No description`
            });
        }

        const totalPages = Math.ceil(commands.length / pageSize);

        const renderPage = async (page: number, i?: ButtonInteraction) => {
            const start = page * pageSize;
            const pageCommands = commands.slice(start, start + pageSize);

            const text = pageCommands.map(cmd => `• **/${cmd.name}** - ${cmd.description}`).join(`\n`);

            const components: any[] = [];
            const row = new ActionRowBuilder<buttonBuilder>();
            if (page > 0) {
                row.addComponents(
                    new buttonBuilder(
                        `Previous`,
                        async (i, payload) => {
                            await renderPage(payload.page, i);
                        },
                        { page: page - 1 }
                    )
                );
            }
            if (page < totalPages - 1) {
                row.addComponents(
                    new buttonBuilder(
                        `Next`,
                        async (i, payload) => {
                            await renderPage(payload.page, i);
                        },
                        { page: page + 1 }
                    )
                );
            }

            if (row.components.length > 0) components.push(row);

            const content = `📃 **Available Commands** (Page ${page + 1}/${totalPages})\n\n${text}\n\nThe Digital Development Club Discord bot was programmed by @Breezist. If there are any problems, please let him know!`;
            let embed = new EmbedBuilder()
                .setDescription(content);

            if (i) {
                await i.update({ embeds: [embed], components });
            } else {
                await message.edit({ embeds: [embed], components });
            }
        };

        await renderPage(0);
    }
);

export { command };
