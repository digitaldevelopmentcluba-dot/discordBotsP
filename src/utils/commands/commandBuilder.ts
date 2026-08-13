import { SlashCommandBuilder, Client, type Interaction, Collection, ChatInputCommandInteraction } from 'discord.js'

export class commandBuilder {
    static client : Client;
    static setClient(client : Client) {
        commandBuilder.client = client;
        client.commands = new Collection();
    }

    name : string = `temp`!;
    description : string = `Temporary description goes here!`!;
    callback : (...any: any) => {};
    category : string = ``;

    options: Array<{
        type: `string`,
        name: string,
        description: string,
        required: boolean,
        choices?: { name: string; value: string }[] | undefined
    }> = [];

    constructor(name : string, description : string, callback : (...any: any) => {}) {
        let commandName = this.name = (name ? name : this.name).toLowerCase();
        this.description = (description ? description : this.description);
        this.callback = callback;
    }

    addStringOption(
        name: string,
        description: string,
        required: boolean = false,
        choices?: { name: string, value: string }[]
    ) {
        this.options.push({
            type: `string`,
            name,
            description,
            required,
            choices
        });
        return this;
    }

    getInteractionOptions(interaction: ChatInputCommandInteraction) {
        const result: Record<string, string | null> = {};

        for (const opt of this.options) {
            if (opt.type === `string`) {
                result[opt.name] = interaction.options.getString(opt.name);
            }
        }

        return result;
    }

    build() {
        const builder = new SlashCommandBuilder()   
            .setName(this.name)
            .setDescription(this.description)
        
        for (const opt of this.options) {
            if (opt.type === `string`) {
                builder.addStringOption(o => {
                    o.setName(opt.name)
                     .setDescription(opt.description)
                     .setRequired(opt.required);

                    if (opt.choices?.length) {
                        for (const choice of opt.choices) {
                            o.addChoices({ name: choice.name, value: choice.value });
                        }
                    }

                    return o;
                });
            }
        }

        return builder;
    }

    setCategory(category : string) {
        this.category = category;
    }
}

export default {
    commandBuilder
}