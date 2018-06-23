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
            ],
            botowner: true,
            path: __filename                                               
        });
    }

    async run(msg, args, lang) {
       switch(args[0]) {
            case undefined:
                await this.client.load();
                return msg.channel.createMessage(lang.reload.all);
            case '-c':
                if(!args[1])
                    return;
                await this.client.loadingManager.loadCommand(this.client.commands.get(args[1]).path);
                return msg.channel.createMessage((lang.reload.cmd).replace("%cmd%", args[1]));
            case '-m':
                break;
            case '-f':
                if(args[1] === 'lang') {
                    this.client.loadingManager.loadLocales();
                    return msg.channel.createMessage(`${this.client.emotes.get('check')}Reloaded all language files.`);
                }
                break;
            default:
                return msg.channel.createMessage(`${this.client.emotes.get('warning')}Wrong parameters.`);
       }
    }
}

module.exports = ReloadCommand;