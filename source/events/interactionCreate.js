/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name interactionCreate.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description
*/
import { Events, CommandInteraction, MessageFlags } from 'discord.js';
import {Button, Modal} from '../util/components.js';

export default {
    event: Events.InteractionCreate,
    async execute(interaction, ...args) {
        if (interaction.isModalSubmit()) {
            const modal = Modal.modals.get(interaction.customId);
            if (!modal) return;

            const responses = {};

            for (const input of modal.inputs) {
                const value = interaction.fields.getTextInputValue(input.id);

                responses[input.question] = value;
            }

            await modal.onSubmit(interaction, responses);
        }

        if(interaction.isButton()) {
            const button = Button.buttons.get(interaction.customId);
            if (!button) return;
            await button.onPress(interaction);
        }

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
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