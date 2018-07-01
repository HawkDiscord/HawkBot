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

    async run(msg, args, lang) {
        return msg.sendInfo(lang.ping.currentPing).replace('%ping%', this.client.shards.get(0).latency);
    }
}

module.exports = PingCommand;