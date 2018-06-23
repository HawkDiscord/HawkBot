const Lavalink = require('eris-lavalink');
const superagent = require('superagent');
const fs = require('fs');
const { updateShardStatus } = require('../../util/functions');

module.exports = (client) => {    
    client.voiceConnections = new Lavalink.PlayerManager(client, client.config.lavalink_nodes, {
        numShards: client.shards.size,
        userId: client.user.id,
        defaultRegion: 'eu',
    });

    var shards = [];

    for (let i = bot.options.firstShardID; i < (bot.options.lastShardID + 1); i++) {
        shards.push(i);
    }

    shards.forEach(shard => {
        console.log(`[`.white + ` INFO `.green + `] `.white + `[`.white + ` Shard `.cyan + `] `.white + `The shard with the id ${shard} has successfully started!`.white);
        updateShardStatus(shard, 0);
    });
}