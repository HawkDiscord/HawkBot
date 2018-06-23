const Command = require('../../command/Command');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            displayName: 'Help',
            description: 'ives you an overview of all commands',
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
        return message.channel.createMessage({
            embed: {
                author: {
                    name: lang.help.general.title,
                    icon_url: this.client.user.avatarURL
                },
                color: 0x14bc05,
                description: lang.help.general.description.replace('%modules%', this.client.modules.size).replace('%commands%', this.client.commands.size);
                footer: {
                    
                }
            }
        });
    }
}

module.exports = PingCommand;