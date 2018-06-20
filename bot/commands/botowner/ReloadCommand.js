const Command = require('../../command/Command');

class ReloadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            displayName: 'Reload',
            description: 'Reloads parts of the bot',
            usages: [
                {
                    usage: '',
                    description: 'Reloads the full bot.'
                },
                {
                    usage: '-m <module>',
                    description: 'Reloads a module.'
                },
                {
                    usage: '-c <command>',
                    description: 'Reloads a command.'
                },
                {
                    usage: '-f <feature>',
                    description: 'Reloads predefined features.'
                }
            ]                                                
        });
    }

    async run(message, args, lang) {
        message.channel.createMessage('kys');
    }
}

module.exports = ReloadCommand;