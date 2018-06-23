const Command = require('../../command/Command');

class PrefixCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            displayName: 'Prefix',
            description: 'Setup the guilds prefix',
            permissions: [client.permissions.MANAGE_GUILD],
            path: __filename
        })
    }

    async run(msg, args, lang) {
        msg.channel.createMessage(msg.guild.prefix);
    }
}

module.exports = PrefixCommand;