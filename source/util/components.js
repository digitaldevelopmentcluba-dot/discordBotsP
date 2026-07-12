/**
 * ┳┓•  •   ┓  ┳┓      ┓              ┏┓┓  ┓ 
 * ┃┃┓┏┓┓╋┏┓┃  ┃┃┏┓┓┏┏┓┃┏┓┏┓┏┳┓┏┓┏┓╋  ┃ ┃┓┏┣┓
 * ┻┛┗┗┫┗┗┗┻┗  ┻┛┗ ┗┛┗ ┗┗┛┣┛┛┗┗┗ ┛┗┗  ┗┛┗┗┻┗┛
 *     ┛                  ┛                  
 * @name bot.js
 * @since July 11th, 2026
 * @authors Breezist
 * @description The entry-point file for 
*/
import {ButtonBuilder, ButtonStyle} from 'discord.js';
import {TextDisplayBuilder, ModalBuilder, LabelComponent, TextInputBuilder, TextInputStyle, ActionRowBuilder} from 'discord.js';

import {randomBytes} from 'node:crypto';

export class TextInput extends TextInputBuilder {
    constructor(
        label,
        required = true,
        style = TextInputStyle.Short,
        maxLength = 200,
        placeholder = ``
    ) {
        super();
        const id = randomBytes(8).toString(`hex`);
        
        this
            .setCustomId(id)
            .setLabel(label)
            .setPlaceholder(placeholder)
            .setRequired(required)
            .setStyle(style)
            .setMaxLength(maxLength);

        this.id = id;
        this.question = label;
    }

    toActionRow() {
        return new ActionRowBuilder().addComponents(this);
    }
}

export class Modal extends ModalBuilder {
    static modals = new Map();

    constructor(title, onSubmit = () => {}, components = []) {
        super();

        const id = randomBytes(8).toString(`hex`);
        this.setCustomId(id);
        this.setTitle(title);

        this.onSubmit = onSubmit;
        this.inputs = components;

        const rows = [];

        for (const component of components) {
            rows.push(component.toActionRow());
        }

        this.addComponents(...rows);

        Modal.modals.set(id, this);
    }
}

export class Text extends TextDisplayBuilder {
    constructor(text = `Undefined`) {
        super();
        this.setContent(text);
    }
}

let defaultUrl = `https://www.google.com/`;
export class Button extends ButtonBuilder {
    static buttons = new Map();

    constructor(buttonData = {
        label: `Undefined`,
        style: ButtonStyle.Success,
    }, onPress = () => {}) {
        super()

        this.id = randomBytes(8).toString(`hex`);
        this.onPress = onPress;

        this.setLabel(buttonData.label);
        this.setStyle(buttonData.style);
        switch(buttonData.style) {
            case ButtonStyle.Link:
                this.setURL(buttonData.url ?? defaultUrl)
                break;
            default:
                this.setCustomId(this.id);
                break;
        }

        Button.buttons.set(this.id, this);
    }
}