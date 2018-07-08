const Command = require('../../command/Command');
const hawkGuild = require('../../entities/HawkGuild.js');

class AutoroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'autorole',
            displayName: 'Autorole',
            description: 'Setup a role that will automatically assigned to new members',
            permissions: [client.permissions.MANAGE_GUILD],
            usages: [
                {
                    usage: '',
                    description: 'Shows the current autorole'
                },
                {
                    usage: 'set <@role>',
                    description: 'Sets a new autorole'
                },
                {
                    usage: 'disable',
                    description: 'Disables the autorole'
                }
            ],
            path: __filename
        });
    }

    async run(msg, args, lang) {
        if(args.length === 0)
            return this.showAutorole(msg, args, lang);
        switch(args[0].toLowerCase()) {
            case 'set':
                return this.setAutorole(msg, args, lang);
            case 'disable':
                return this.disableAutorole(msg, args, lang);
        }
        this.sendHelp(msg, lang);
    }

    async setAutorole(msg, args, lang) {
        if(msg.roleMentions.length !== 1)
            return this.sendHelp(msg, lang);
        let role = msg.guild.roles.get(msg.roleMentions[0]);
        if(!role)
            return msg.sendError(lang.autorole.error);
        hawkGuild.update(this.client, msg.guild, {autorole: role.id});
        return msg.sendSuccess(lang.autorole.set);
    }

    async disableAutorole(msg, args, lang) {
        if(msg.guild.autorole === 'none')
            return msg.sendInfo(lang.autorole.notEnabled);
        hawkGuild.update(this.client, msg.guild, {autorole: 'none'});
        return msg.sendSuccess(lang.autorole.disabled);
    }

    async showAutorole(msg, args, lang) {
        if(msg.guild.autorole === 'none')
            return msg.sendIngo(lang.autorole.none);
        let role = msg.guild.roles.get(msg.guild.autorole);
        if(!role) {
            hawkGuild.update(this.client, msg.guild, {
                autorole: 'none'
            });
            return msg.sendInfo(lang.autorole.none);
        }

        return msg.sendInfo(lang.autorole.current.replace('%role%', role.name));
    }
}

module.exports = AutoroleCommand;