import { SlashCommandBuilder, Client, type Interaction, Collection, ButtonBuilder, ButtonStyle, ButtonInteraction, SectionBuilder, TextDisplayBuilder } from 'discord.js'
import { randomUUID } from 'node:crypto';

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

export class sectionBuilder extends SectionBuilder { 
    constructor(...text : string[]) {
        super();
        for (let txt of text) {
            let textDisplay = new TextDisplayBuilder()
                .setContent(txt);
            this.addTextDisplayComponents(textDisplay);
        }
    }
}