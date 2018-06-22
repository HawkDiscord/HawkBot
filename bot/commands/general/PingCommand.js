const Command = require('../../command/Command');

class PingCommand extends Command {
    constructor(client) {
        super(client,{
            name: 'ping',
            displayName: 'Ping',
            description: 'Test the latency of the bot to the Discord API',
            usages: [
                {
                    usage: '',
                    description : 'Returns the Bot Heartbeat ping in ms'
                }
            ]
        })
    }

    async run(message, args, lang) {
        
    }
}

module.exports = PingCommand;