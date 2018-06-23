const Command = require('../../command/Command');

class PingCommand extends Command {
    constructor(client) {
        super(client,{
            name: 'ping',
            displayName: 'Ping',
            description: 'Test the latency of the bot to the Discord API',
            path: __filename
        })
    }

    async run(message, args, lang) {
        message.channel.awaitMessage()
        return message.channel.sendMessage(this.client.emotes.get('info') + ' ' + (lang.ping.currentPing).replace('%ping%', this.client.shards.get(0).latency));
    }
}

module.exports = PingCommand;