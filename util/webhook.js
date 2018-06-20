const superagent = require("superagent");
const shardhook = require(require("path").resolve("data/config.json")).webhooks.shard.url;
const workerhook = require(require("path").resolve("data/config.json")).webhooks.worker.url;

module.exports.sendWorker = async embed => {
    if(!workerhook) return false;
    return await superagent.post(workerhook).send({ embeds: [embed] , username: "Worker"});
};

module.exports.sendShard = async embed => {
    if(!shardhook) return false;
    return await superagent.post(shardhook).send({ embeds: [embed] , username: "Shard"});
};

module.exports.send = async (username,content,webhookurl) => {
    if(!webhookurl) return false;
    return await superagent.post(webhookurl).send({ content: content , username : username})
}