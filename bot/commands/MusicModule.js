const Module = require('../command/Module.js');

class MusicModule extends Module {
    constructor(client) {
        super(client, {
            name: 'music',
            displayName: 'Music',
            description: 'Commands for using the music-feature.',
            pathToCommands: __dirname + '/music'
        });
    }
}

module.exports = MusicModule;