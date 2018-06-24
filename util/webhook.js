const superagent = require("superagent");
const shardhook = require(require("path").resolve("data/config.json")).webhooks.shard;
const workerhook = require(require("path").resolve("data/config.json")).webhooks.worker;
const webpanel = require(require("path").resolve("data/config.json")).webhooks.webpanel;

module.exports.sendWorker = async embed => {
    if(!workerhook) return false;
    return await superagent.post(workerhook).send({ embeds: [embed] , username: "Worker"});
};

module.exports.sendShard = async embed => {
    if(!shardhook) return false;
    return await superagent.post(shardhook).send({ embeds: [embed] , username: "Shard"});
};

module.exports.sendWebpanelLogin = async user => {
    if (!webpanel.login) return false;
    superagent.post(webpanel.login).send({
        username: user.tag,
        avatar_url: user.avatarUrl,
        content: `[${getTimestamp()}] Logged In`
    }).then();
};

module.exports.send = async (username, content, webhookurl) => {
    if(!webhookurl) return false;
    return await superagent.post(webhookurl).send({ content: content , username : username})
}

function getTimestamp() {
    let date = new Date();
    let minute = date.getMinutes();
    let hour = date.getHours();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${hour}:${minute} ${day}.${month}.${year}`;
}