const fs = require('fs');
const rethinkdbdash = require('rethinkdbdash');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));

module.exports = {
    connectToRethink: async () => {
        return await rethinkdbdash(config.rethinkdb);
    },

    createDefaults: async () => {

    }
}