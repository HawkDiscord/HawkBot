const Command = require('../../command/Command');

class KeyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'key',
            displayName: 'Key',
            description: 'Redeem your gift Keys',
            usages: [
                {
                    usage: '-r <key>',
                    description: 'Redeem a Key'
                },
                {
                    usage : '-g <option>',
                    description : 'Generate a Key for given option'
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

module.exports = KeyCommand;