const Module = require('../command/Module');

class SettingsModule extends Module {
    constructor(client) {
        super(client, {
            name: 'settings',
            displayName: 'Settings',
            description: 'Commands to configure Hawk on your guild',
            pathToCommands: __dirname + '/settings'
        });
    }
}

module.exports = SettingsModule;