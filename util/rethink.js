const fs = require('fs');
const rethinkdbdash = require('rethinkdbdash');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));

module.exports = {
    connectToRethink: async () => {
        Object.assign(config.rethinkdb, { silent: true });
        return await rethinkdbdash(config.rethinkdb);
    },

    createDefaults: async (rethink) => {
        const tables = ['guilds', 'users']

        for (let i = 0; i < tables.length; i++) {
            try {
                await rethink.tableCreate(tables[i]).run();
            } catch (e) {
                //Table exists
            }
        }
    }
}