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
        msg.delete();
        switch (args[0]) {
            case '-g':
            if (this.client.config.owners.indexOf(msg.author.id) <= -1)
                return `${this.client.emotes.get('warning')} ${lang.commandParser.noPermissions}`;
            if(args[1])
                switch(args[1]){
                    case 'beta':
                        let dateNow = Date.now();
                        await this.client.rethink.table('keys').insert({ type: 'beta', date: dateNow, creator: msg.author.id }).run();
                        let key = await this.client.rethink.table('keys').filter({date: dateNow}).run();
                        await msg.author.getDMChannel().then(channel => channel.createMessage(`Your Generated Key: \`${key[0].id}\` `));
                }
            break;
            default:
            let dataEntry = await this.client.rethink.table('keys').get(args[0]).run();
            if(dataEntry == null)
                return lang.key.invalid;
            switch(dataEntry.type){
                case 'beta':
                await this.client.rethink.table('keys').get(args[0]).delete().run();
                await this.client.rethink.table('guilds').get(msg.guild.id).update({ beta: true }).run();
                return lang.key.success
               }
            }  
            break;
        }
    }


module.exports = KeyCommand;