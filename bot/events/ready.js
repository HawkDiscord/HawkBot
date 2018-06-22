const superagent = require('superagent');

module.exports = client => {
    client.info('Shard', `The shard with the id ${client.shard.id} started and connected successfully!`);
    superagent.post(`${client.config.webpanel.baseurl}/api/shards/${client.shard.id}/status`).send({
        token: client.config.webpanel.token,
        status: '0'
    }).then(() => {
        //
    });
}