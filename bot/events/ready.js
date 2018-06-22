const superagent = require('superagent');

module.exports = client => {
    client.info('Shard', 'Started!');
    superagent.post(`${client.config.webpanel.baseurl}/api/shards/${client.shard.id}/status`).send({
        token: client.config.webpanel.token,
        status: 'ready'
    }).then(() => {
        //
    });
}