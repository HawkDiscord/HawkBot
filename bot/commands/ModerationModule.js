const Module = require('../command/Module');

class ModerationModule extends Module {
    constructor(client) {
        super(client, {
            name: 'moderation',
            displayName: 'Moderation',
            description: 'Commands to moderate your server',
            pathToCommands: __dirname + '/moderation'
        });
    }
}

module.exports = ModerationModule;