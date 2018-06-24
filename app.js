global.Promise = require("bluebird");
global.cluster = require('cluster');
const fs = require('fs');
const { Webpanel } = require('./webpanel/Webpanel.js');
const Sharder = require('./sharding/ShardingManager');
const { sendWorker:webhook } = require('./util/webhook.js');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));
require('./sharding/OutputHandler');


const sharder = new Sharder(config.bot.token, `${__dirname}/bot/Hawk.js`, {
    disableEvents: { TYPING_START: true },
    messageLimit: 0,
    defaultImageFormat: "png",
    defaultImageSize: 256
});

sharder.on('workerStarted', worker => {
    webhook({
        author: {
            name: `Launched #${worker.id}`,
            icon_url: 'https://cdn.discordapp.com/icons/457992291001303041/ccf0a32ae94a37f5a1e1ccc7e81fb1c9.png'
        },
        color: 0x37b739,
        fields: [
            {
                name: 'Total Shards',
                value: `Count: ${worker.shardsPerWorker}`,
                inline: true,
            },
            {
                name: 'Shards on Worker',
                value: `Total ${worker.shardStart}-${worker.shardEnd}`,
                inline: true
            }
        ]
    });
});

sharder.on('workerReboot', worker => {
    webhook({
        author: {
            name: `Rebooted #${worker.id}`,
            icon_url: 'https://cdn.discordapp.com/icons/457992291001303041/ccf0a32ae94a37f5a1e1ccc7e81fb1c9.png'
        },
        color: 0x37b739,
        fields: [
            {
                name: 'Total Shards',
                value: `Count: ${worker.shardsPerWorker}`,
                inline: true,
            },
            {
                name: 'Shards on Worker',
                value: `Total ${worker.shardStart}-${worker.shardEnd}`,
                inline: true
            }
        ]
    });
});

sharder.launch();

if(cluster.isMaster)
    new Webpanel(sharder);