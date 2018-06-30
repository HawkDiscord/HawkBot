const Command = require('../../command/Command');
const util = require("util");


class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            displayName: 'Eval',
            description: 'Evaluate code in shards',
            usages: [
                {
                    usage: '-s <shardId>',
                    description: 'Evaluate on specific shard'
                }
            ],
            botowner: true,
            path: __filename
        })
    }

    async run(msg, args, lang) {
        switch (args[0]) {
            case '-s':
            let result = (await process.output({
                type: 'shard',
                target: args[1],
                input: `${args.splice(2,2).join(" ")}`
            }));
            result.result = util.inspect(result.result, { depth: 0 })
            .substring(0, 1950)
            .replace(new RegExp(this.client.config.bot.token, "gi"), "");
            console.log(result)
            if(result.result !== '' && result.result != 'undefined')
            return msg.channel.createMessage(`:inbox_tray:  **Result:** \`\`\`js\n${result.result}\n\`\`\``);
            else
            return msg.channel.createMessage(`:outbox_tray:  **Error:** \`\`\`js\n${result.error}\n\`\`\``);
        }
    }
}

module.exports = EvalCommand;