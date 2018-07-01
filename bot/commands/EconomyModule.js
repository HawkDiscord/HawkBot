const Module = require('../command/Module');

class EconomyModule extends Module {
    constructor(client) {
        super(client, {
            name: 'economy',
            displayName: 'Economy',
            description: 'Commands that are used to become rich :dollar:',
            pathToCommands: __dirname + '/economy'
        });
    }
}

module.exports = EconomyModule;