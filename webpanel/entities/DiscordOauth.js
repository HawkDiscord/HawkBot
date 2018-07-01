const superagent = require('superagent');

class DiscordUser {
    constructor(userData, guildsData) {
        this.username = userData.username;
        this.locale = userData.locale;
        this.mfaEnabled = userData.mfa_enabled;
        this.avatar = userData.avatar;
        this.discriminator = userData.discriminator;
        this.id = userData.id;
        this.tag = `${this.username}#${this.discriminator}`;
        this.avatarUrl = this.avatar ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
        this.guilds = parseGuildArray(guildsData);
    }
}

class DiscordGuild {
    constructor(guildData) {
        this.owner = guildData.owner;
        this.permissions = guildData.permissions;
        this.icon = guildData.icon;
        this.id = guildData.id;
        this.name = guildData.name;
        this.iconUrl = this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png` : null;
    }

    hasPermission(code) {
        return (this.permissions & code) === code;
    }
}

function parseGuildArray(guildsData) {
    if(!guildsData)
        return null;
    let res = [];
    guildsData.forEach(rawGuild => {
        res.push(new DiscordGuild(rawGuild));
    });
    return res;
}

async function fetchUser(accessToken) {
    let userDataRaw = await superagent.get('https://discordapp.com/api/users/@me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send().catch(err => {
            process.instance.error('UserFetch', err);
        });
    let guildsDataRaw = await superagent.get('https://discordapp.com/api/users/@me/guilds')
        .set('Authorization', `Bearer ${accessToken}`)
        .send().catch(err => {
            process.instance.error('UserFetch', err);
        });
    if(!userDataRaw || !guildsDataRaw)
        return null;
    
    return new DiscordUser(JSON.parse(userDataRaw.text), JSON.parse(guildsDataRaw.text));
}

async function fetchUserWithoutGuilds(accessToken) {
    let userDataRaw = await superagent.get('https://discordapp.com/api/users/@me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send().catch(err => {
            process.instance.error('UserFetch', err);
        });
    if(!userDataRaw)
        return null;
    return new DiscordUser(JSON.parse(userDataRaw.text), null);
}

module.exports = {
    DiscordUser,
    DiscordGuild,
    fetchUser,
    fetchUserWithoutGuilds
}