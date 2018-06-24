const Command = require('../../command/Command');

class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            aliases: ['purge'],
            displayName: 'Clear',
            description: 'Clears a specific amount of messages in a channel',
            usages: [
                {
                    usage: '<amount>',
                    description: 'Deletes a specific amount of messages'
                },
                {
                    usage: '<@User> <amount>',
                    description: 'Deletes messages that are sent by a specific user'
                }
            ],
            permissions: [client.permissions.MANAGE_MESSAGES],
            path: __filename
        })
    }

    async run(msg, args, lang) {
        if(!msg.self.permission.has(this.client.permissions.MANAGE_MESSAGES) && !msg.self.permission.has(this.client.permissions.ADMINISTRATOR))
            return msg.channel.createMessage(`${this.client.emotes.get('warning')}${lang.clear.noPerms}`);
        if(args.length === 0)
            return this.sendHelp(msg, lang);
        if(msg.mentions.length === 1)
            return this.clearUserMessages(msg, args, lang);
        msg.channel.deleteMessages(ids);
    }

    async clearUserMessages(msg, args, lang) {
        if(args.length !== 2)
            return this.sendHelp(msg, lang);
        let userId = msg.mentions[0].id;
        let amount = parseInt(args[1]);
        if(!amount)
            return this.sendHelp(msg, lang);
        if(amount > 500)
            return msg.channel.createMessage(`${this.client.emotes.get('warning')}${lang.clear.maxAmount.replace('%amount%', 500)}`);
        let rawMessages = await msg.channel.getMessages(amount);
        let messageIds = [];
        rawMessages.forEach(message => {
            if(message.author.id === userId)
                messageIds.push(message.id);
        });
        msg.channel.deleteMessages(messageIds);
        msg.channel.createMessage(`${this.client.emotes.get('check')}${lang.clear.cleared.replace('%amount%', messageIds.length)}`);
    }
}

module.exports = ClearCommand;