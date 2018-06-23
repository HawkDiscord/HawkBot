const Command = require('../../command/Command');

class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            displayName: 'Help',
            description: 'Gives you an overview of all commands',
            usages: [{
                    usage: '',
                    description: 'Shows all modules and their commands in a short form.'
                },
                {
                    usage: '<command>',
                    description: 'Shows all information about a command.'
                }
            ],
            path: __filename
        })
    }

    async run(message, args, lang) {
        let embed = {
            author: {
                name: lang.help.general.title,
                icon_url: this.client.user.avatarURL
            },
            color: 0x14bc05,
            description: lang.help.general.description.replace('%modules%', this.client.modules.size - 1).replace('%commands%', this.client.rawCommands.size),
            fields: [],
            footer: {
                text: lang.help.general.footer.replace('%prefix%', message.guild.prefix)
            }
        };

        this.client.modules.forEach(cmodule => {
            if(cmodule.name === 'botowner')
                return;
            let value = '';
            cmodule.commands.forEach(command => {
                value += ' `' + command + '`';
            });
            if(value === '')
                return;
            embed.fields.push({
                name: `${cmodule.displayName} - Module`,
                value: value,
                inline: false
            });
        });

        return message.channel.createMessage({
            embed: embed
        });
    }
}

module.exports = HelpCommand;