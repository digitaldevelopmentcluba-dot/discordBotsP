import fs from 'fs';
import { SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    data: new SlashCommandBuilder().setName('about').setDescription('Provides information about the club!'),
    async execute(interaction) {
        const message = {
            flags: 32768,
            components: [
                {
                    type: 17,
                    components: [
                        {
                            type: 12,
                            items: [
                                {
                                    media: { url: `https://media.discordapp.net/attachments/1296940074562355212/1525739376838181086/banner.png?ex=6a547b06&is=6a532986&hm=445996638020ffb7bb33e8d31fb9fe66e2c97f963975d898988f5c68fed7c3c8&=&format=webp&quality=lossless&width=550&height=183` }
                                }
                            ]
                        },
                        {
                            type: 10,
                            content: `Welcome to the Digital Development Club, <@${interaction.user.id}>!`
                        },
                        {
                            type: 14,
                            spacing: 1,
                            divider: true
                        },
                        {
                            type: 10,
                            content:
                                "Are you passionate about game development, coding, and creativity? The Digital Development Club is looking for new members to join our team! Whether you're a beginner or an experienced developer, this is a great opportunity to collaborate, learn, and build exciting projects together.\n\n* Work on real game projects,\n* learn coding techniques and game development skills,\n* collaborate with like-minded students,\n* and have fun and showcase your creativity"
                        },
                        {
                            type: 14,
                            spacing: 1,
                            divider: true
                        },
                        {
                            type: 10,
                            content:
                                `* We are currently at **${interaction.client.guilds.cache.get('1424234811354255382').memberCount}** members!\n* The club's current president is <@210179841817837569>!`
                        },
                        {
                            type: 14,
                            spacing: 1,
                            divider: true
                        },
                        {
                            type: 10,
                            content: "Invite people to the club through this invite link: \nhttps://discord.gg/mm8pVztMVf"
                        }
                    ]
                }
            ],
            ephemeral: true
        };
        await interaction.reply(message);
    }
};
