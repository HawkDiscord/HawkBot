const Command = require('../../command/Command');
const hawkGuild = require('../../entities/HawkGuild.js');

class PrefixCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            displayName: 'Prefix',
            description: 'Setup the guilds prefix',
            usages: [
                {
                    usage: '',
                    description: 'Shows the current prefix'
                },
                {
                    usage: 'set <prefix>',
                    description: 'Changes the guilds prefix'
                }
            ],
            permissions: [client.permissions.MANAGE_GUILD],
            path: __filename
        })
    }

    async run(msg, args, lang) {
        if(args.length === 2) {
            if(args[0] !== 'set')
                return await this.sendCurrentPrefix(msg, lang);
            let newPrefix = args[1];
            if(newPrefix.length > 5)
                return msg.sendError(lang.prefix.length);
            hawkGuild.update(this.client, msg.guild, {prefix: newPrefix});
            return msg.sendSuccess(lang.prefix.success);
        } else
            return await this.sendCurrentPrefix(msg, lang);
    }

    async sendCurrentPrefix(msg, lang) {
        return msg.sendInfo(lang.prefix.current.replace('%prefix%', msg.guild.prefix));
    }
}

module.exports = PrefixCommand;