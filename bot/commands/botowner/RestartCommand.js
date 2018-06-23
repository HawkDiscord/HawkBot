const Command = require('../../command/Command');

class RestartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            displayName: 'Restart',
            description: 'Restarts the bot',
            usages: [
                {
                    usage: '',
                    description: 'Restarts the current shard.'
                },
                {
                    usage: '-s <shardId>',
                    description: 'Restarts a single shard.'
                },
                {
                    usage: '-a',
                    description: 'Restarts all shards.'
                }
            ],
            permissions: {
                botowner: true,
                permission: 'none'
            },
            path: __filename
        });
    }

    async run(msg, args, lang) {
       switch(args[0]){
            case undefined:
                await msg.channel.createMessage(`${this.client.emotes.get("info")} ${lang.restart.currentShard}`);
                process.exit(1);
                break;
            case '-s':
                if(!args[1])
                    return;
                await msg.channel.createMessage(`${this.client.emotes.get("info")} ${lang.commandParser.noInvoke.replace('%shard%', args[1])}`);
                (await process.output({
                    type: 'shard',
                    target: args[1],
                    input: () => process.exit(1)
                }));
                break;
            case '-a':
                await msg.channel.createMessage(`${this.client.emotes.get("info")} ${lang.restart.allShards}`);
                console.log(await process.output({
                    type: 'all_shards',
                    input: () => process.exit(1)
                }));
                break;
       }
    }
}

module.exports = RestartCommand;