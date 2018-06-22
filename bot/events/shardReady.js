const superagent = require('superagent');

module.exports = id => {
    client.info('Shard', 'Started!');
    superagent.post(`${client.config.webpanel.baseurl}/api/shards/${id}/status`).send({
        token: client.config.webpanel.token,
        status: 0
    }).then(() => {
        //
    });
}