const Module = require('../command/Module.js');

class ToolsModule extends Module {
    constructor(client) {
        super(client, {
            name: 'tools',
            displayName: 'Tools',
            description: 'Commands for using helpful tools.',
            pathToCommands: __dirname + '/tools'
        });
    }
}

module.exports = ToolsModule;