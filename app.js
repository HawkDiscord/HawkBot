const fs = require('fs');
const { Hawk } = require('./bot/Hawk.js');
const { Webpanel } = require('./webpanel/Webpanel.js');
const rethinkdb = require('./util/rethink.js');
const Sharder = require('eris-sharder').Master;

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));
const rethink = rethinkdb.connectToRethink();

const sharder = new Sharder(config.bot.token, '/bot/Hawk.js', {
    stats: true,
    webhooks: {
        shard: config.webhooks.shard,
        cluster: config.webhooks.cluster,
        clientOptions: {
            rethink: rethink
        }
    },
    name: "Hawk"
});