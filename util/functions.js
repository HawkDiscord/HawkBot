const fs = require('fs');
const { post } = require('superagent');

const config = JSON.parse(fs.readFileSync('./data/config.json', 'utf-8'));

module.exports = {
    updateShardStatus(id, status) {
        post(`${config.webpanel.baseurl}/api/shards/${id}/status`).send({
            token: config.webpanel.token,
            status: status
        }).then(() => {
            //
        });
    }
}