import { SlashCommandBuilder, Client, type Interaction, Collection } from 'discord.js'

export class commandBuilder {
    static client : Client;
    static setClient(client : Client) {
        commandBuilder.client = client;
        client.commands = new Collection();
    }

    name : string = `temp`!;
    description : string = `Temporary description goes here!`!;
    callback : (...any: any) => {};
    category : string = "";

    constructor(name : string, description : string, callback : (...any: any) => {}) {
        let commandName = this.name = (name ? name : this.name).toLowerCase();
        this.description = (description ? description : this.description);
        this.callback = callback;
    }

    build() {
        return new SlashCommandBuilder()   
            .setName(this.name)
            .setDescription(this.description)
    }

    setCategory(category : string) {
        this.category = category;
    }
}

export default {
    commandBuilder
}