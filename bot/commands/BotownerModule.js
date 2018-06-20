const Module = require('../command/Module.js');

class BotownerModule extends Module {
    constructor(client) {
        super(client, {
            name: 'botowner',
            displayName: 'Botowner',
            description: 'Commands only for the owners of the bot',
            pathToCommands: __dirname + '/botowner'
        });
    }
}

module.exports = BotownerModule;