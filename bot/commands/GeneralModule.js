const Module = require('../command/Module');

class GeneralModule extends Module {
    constructor(client){
        super(client,{
            name: 'general',
            displayName: 'General',
            description: 'General Commands without special Module',
            pathToCommands: __dirname+'/general'
        });
    }


}

module.exports = GeneralModule;