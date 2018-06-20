global.cluster = require('cluster');
const fs = require('fs');
const { Webpanel } = require('./webpanel/Webpanel.js');
const Sharder = require('./sharding/ShardingManager');
const { webhook:sendWorker } = require('./util/webhook.js');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));

const sharder = new Sharder(config.bot.token, `${__dirname}/bot/Hawk.js`, {
    disableEvents: { TYPING_START: true },
    messageLimit: 0,
    defaultImageFormat: "png",
    defaultImageSize: 256
});

sharder.on('workerStarted', worker => {
    webhook({
        title: `Worker #${worker.id} started!`,
        color: 0x37b739,
        description: `Shards: ${worker.shardStart}-${worker.shardEnd} // Total: ${worker.shardRange}`
    });
});

sharder.launch();

let panel = new Webpanel(sharder);