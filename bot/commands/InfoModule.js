const Module = require('../command/Module');

class InfoModule extends Module {
    constructor(client){
        super(client,{
            name: 'info',
            displayName: 'Info',
            description: 'Commands that are providing information about the bot',
            pathToCommands: __dirname + '/info'
        });
    }
}

module.exports = InfoModule;