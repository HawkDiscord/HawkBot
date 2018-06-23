const hawkGuild = require('../entities/HawkGuild.js');
const hawkUser = require('../entities/HawkUser.js');

async function run(client, msg) {
    if(msg.author.bot || !msg.guild)
        return;
            
    await hawkGuild.check(client, msg.guild);
    await hawkGuild.reload(client, msg.guild);
    await hawkUser.check(client, msg.author);

    let guild = client.servers.get(msg.guild.id);
    let author = client.members.get(msg.author.id);

    if (!guild || !author)
        return await run(client, msg);

    msg.author = author;

    const prefixes = [client.config.bot.prefixes.default, `<@${await client.getSelf().then(user => user.id)}>`, guild.prefix];
    let prefix;

    for(const curPrefix of prefixes){
        if(await msg.content.indexOf(curPrefix) === 0)
            prefix = curPrefix;
    }

    if(!prefix)
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const invoke = args.shift().toLowerCase();
    let lang = client.locales[author.language];
    
    if(!invoke || invoke === '')
        return await msg.channel.createMessage(`${client.emotes.get("info")} ${lang.commandParser.noInvoke.replace('%prefix%', guild.prefix)}`);
    let cmd = client.commands.get(invoke);
    if(!cmd)
        return;
    if(!guild.members.get(client.user.id).permission.has(client.permissions.SEND_MESSAGES))
        return;
    if(!msg.member.permission.has(client.permissions.ADMINISTRATOR)) {
        for(let permission of cmd.permissions) {
            if(!msg.member.permission.has(permission))
                return msg.channel.createMessage(`${client.emotes.get('warning')} You don't have enough permissions to execute this command.`);
        }
    }
    cmd.run(msg, args, lang).catch(error => {
        if (error.message || error.stack)
            console.log(error);
        msg.channel.createMessage(error.toString());
    });
}

module.exports = run;