const autorole = require('./impl/autorole');

async function run(client, guild, member) {
    autorole(client, guild, member);
}

module.exports = run;