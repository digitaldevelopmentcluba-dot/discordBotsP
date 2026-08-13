import { SlashCommandBuilder, Client, type Interaction, Collection, ButtonBuilder, ButtonStyle, ButtonInteraction, SectionBuilder, TextDisplayBuilder, ModalBuilder, type ModalSubmitInteraction, TextInputStyle, TextInputBuilder, ActionRowBuilder } from 'discord.js'
import { randomUUID } from 'node:crypto';

/**
 * @usage
 * let button = new buttonBuilder("Test", ((i : ButtonInteraction) => {
        i.reply({content: "Hello world!"})
    }));

    let actionRow = new ActionRowBuilder<buttonBuilder>()  
        .addComponents(button)

    interaction.reply({components: [actionRow]})
 */
export class buttonBuilder extends ButtonBuilder {
    private static registry = new Map<string, (i: ButtonInteraction, payload?: any) => any>();

    constructor(label: string, callback: (i: ButtonInteraction, payload?: any) => any, payload?: any) {
        super();

        const uuid = randomUUID();
        const payloadString = payload ? Buffer.from(JSON.stringify(payload)).toString(`base64`) : ``;
        const id = payload ? `${uuid}|${payloadString}` : uuid;

        this
            .setCustomId(id)
            .setLabel(label)
            .setStyle(ButtonStyle.Primary);

        buttonBuilder.registry.set(uuid, callback);
        console.log(uuid);
    }

    static async handle(interaction: ButtonInteraction) {
        const [uuid, payloadEncoded] = interaction.customId.split(`|`);

        const callback = buttonBuilder.registry.get(uuid ? uuid : ``);

        let payload = undefined;
        if (payloadEncoded) {
            try {
                payload = JSON.parse(Buffer.from(payloadEncoded, `base64`).toString());
            } catch {}
        }

        if (callback) return callback(interaction, payload);
    }
}

/**
 * @usage
 * const modal = new modalBuilder(
    `What is your input?`,
        (interaction, fields) => {
            const {input} = fields;
            console.log(`Input:`, input);
            interaction.reply({ content: `Input submitted!`, ephemeral: true });
        },
    );

    modal.addInput({
        id: `input`,
        label: `Your input goes here!`,
        style: TextInputStyle.Short
    });

    await interaction.showModal(modal);
 */
export class modalBuilder extends ModalBuilder {
    private static registry = new Map<
        string,
        (i: ModalSubmitInteraction, fields: Record<string, string>, payload?: any) => any
    >();

    private inputIds: string[] = [];

    constructor(
        title: string,
        callback: (i: ModalSubmitInteraction, fields: Record<string, string>, payload?: any) => any,
        payload?: any
    ) {
        super();

        const uuid = randomUUID();
        const payloadString = payload
            ? Buffer.from(JSON.stringify(payload)).toString(`base64`)
            : ``;
        const id = payload ? `${uuid}|${payloadString}` : uuid;
        this.setCustomId(id).setTitle(title);
        modalBuilder.registry.set(uuid, callback);
    }

    addInput(options: {
        id: string; label: string; style?: TextInputStyle; required?: boolean; placeholder?: string; value?: string;
    }) {
        const input = new TextInputBuilder()
            .setCustomId(options.id)
            .setLabel(options.label)
            .setStyle(options.style ?? TextInputStyle.Short)
            .setRequired(options.required ?? true);

        if (options.placeholder) input.setPlaceholder(options.placeholder);
        if (options.value) input.setValue(options.value);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
        this.addComponents(row);
        this.inputIds.push(options.id);
        return this;
    }

    static async handle(interaction: ModalSubmitInteraction) {
        const [uuid, payloadEncoded] = interaction.customId.split(`|`);

        const callback = modalBuilder.registry.get(uuid ?? ``);
        if (!callback) return;

        let payload = undefined;
        if (payloadEncoded) {
            try {
                payload = JSON.parse(Buffer.from(payloadEncoded, `base64`).toString());
            } catch {}
        }

        const fields: Record<string, string> = {};
        for (const id of interaction.fields.fields.keys()) {
            fields[id] = interaction.fields.getTextInputValue(id);
        }
        return callback(interaction, fields, payload);
    }
}