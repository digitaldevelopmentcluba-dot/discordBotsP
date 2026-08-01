import {commandBuilder} from '#utils/commandBuilder.js';
import { type Interaction, type ChatInputCommandInteraction, type ActionRow, MessageFlags, ActionRowBuilder, ButtonInteraction, ButtonComponent, TextInputStyle } from 'discord.js';
import { buttonBuilder, modalBuilder } from '#utils/components.js';

let command = new commandBuilder(`testing`, `Command used for testing purposes!`, async function(interaction : ChatInputCommandInteraction) {
    const modal = new modalBuilder(
    "Report Issue",
        (interaction, fields) => {
            const {desc} = fields;
            console.log("Issue:", desc);
            interaction.reply({ content: "Issue submitted!", ephemeral: true });
        },
    );

    modal.addInput({
        id: "desc",
        label: "Describe the issue",
        style: TextInputStyle.Short
    });

    await interaction.showModal(modal);
});

command.setCategory("Test");


export { command };
