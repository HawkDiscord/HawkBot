const fs = require('fs');
const { post } = require('superagent');

const MusicManager = require('../bot/core/MusicManager');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));



module.exports = {
    updateShardStatus(id, status) {
        post(`${config.webpanel.baseurl}/api/shards/${id}/status`).send({
            token: config.webpanel.token,
            status: status
        }).then(() => {
            //
        });
    },

    checkGuildMusicManager(client, guild) {
        if(!client.players.has(guild.id))
            client.players.set(guild.id, new MusicManager(client, guild));
    }
}