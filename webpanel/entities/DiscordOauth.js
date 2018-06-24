const superagent = require('superagent');

class DiscordUser {
    constructor(userData, guildData) {
        this.username = userData.username;
        this.locale = userData.locale;
        this.mfaEnabled = userData.mfa_enabled;
        this.avatar = userData.avatar;
        this.discriminator = userData.discriminator;
        this.id = userData.id;
        this.tag = `${this.username}#${this.discriminator}`;
        this.avatarUrl = this.avatar ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
        this.guilds = guildData;
    }
}

async function fetchUser(accessToken) {
    let userDataRaw = await superagent.get('https://discordapp.com/api/users/@me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send().catch(err => {
            process.instance.error('UserFetch', err);
        });
    let guildDataRaw = await superagent.get('https://discordapp.com/api/users/@me/guilds')
        .set('Authorization', `Bearer ${accessToken}`)
        .send().catch(err => {
            process.instance.error('UserFetch', err);
        });
    if(!userDataRaw || !guildDataRaw)
        return null;
    
    return new DiscordUser(JSON.parse(userDataRaw.text), JSON.parse(guildDataRaw.text));
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
    fetchUser,
    fetchUserWithoutGuilds
}