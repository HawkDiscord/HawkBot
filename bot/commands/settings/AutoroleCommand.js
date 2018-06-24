const Command = require('../../command/Command');
const hawkGuild = require('../../entities/HawkGuild.js');

class AutoroleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'autorole',
            displayName: 'Autorole',
            description: 'Setup a role that will automatically assigned to new members',
            permissions: [client.permissions.MANAGE_GUILD],
            path: __filename
        })
    }

    async run(msg, args, lang) {
        //TODO
    }
}

module.exports = AutoroleCommand;