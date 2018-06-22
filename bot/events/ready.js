const superagent = require('superagent');
const fs = require('fs');
const { updateShardStatus } = require('../../util/functions');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));

module.exports = () => {
    var shards = [];

    for (let i = bot.options.firstShardID; i < (bot.options.lastShardID + 1); i++) {
        shards.push(i);
    }

    shards.forEach(shard => {
        console.log(`[`.white + ` INFO `.green + `] `.white + `[`.white + ` Shard `.cyan + `] `.white + `The shard with the id ${shard} has successfully started!`.white);
        updateShardStatus(shard, 0);
    });
}