import {commandBuilder} from '#utils/commandBuilder.js';
import { type Interaction, type ChatInputCommandInteraction, type ActionRow, MessageFlags, ActionRowBuilder, ButtonInteraction, ButtonComponent } from 'discord.js';
import { buttonBuilder } from '#utils/components.js';

let command = new commandBuilder(`testing`, `Command used for testing purposes!`, async function(interaction : ChatInputCommandInteraction) {
    let button = new buttonBuilder("Test", ((i : ButtonInteraction) => {
        i.reply({content: "Hello world!"})
    }));

    let actionRow = new ActionRowBuilder<buttonBuilder>()  
        .addComponents(button)

    interaction.reply({components: [actionRow]})
});

export { command };
