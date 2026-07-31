import { Events, CommandInteraction, MessageFlags, type Interaction } from 'discord.js';
import {commandBuilder} from '#utils/commandBuilder.js'
import { buttonBuilder } from '#utils/components.js';

export default {
    event: Events.InteractionCreate,
    async execute(interaction : Interaction, ...args : any) {
        if (interaction.isButton()) {
            return buttonBuilder.handle(interaction);
        }

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.callback(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: 'There was an error while executing this command!',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        }
    }
}