const hawkGuild = require('../../entities/HawkGuild.js');

async function run(client, erisGuild, member) {
    await hawkGuild.check(client, erisGuild);
    let guild = client.servers.get(erisGuild.id);
    if(guild.autorole === 'none')
        return;
    let role = guild.roles.get(guild.autorole);
    if (!role || !guild.members.get(client.user.id).permission.has(client.permissions.ADMINISTRATOR) && !guild.members.get(client.user.id).permission.has(client.permissions.MANAGE_ROLES))
        return hawkGuild.update(client, guild, {autorole: 'none'});
    guild.addMemberRole(member.id, role.id, 'Autorole');
}
module.exports = run;