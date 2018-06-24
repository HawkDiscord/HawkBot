module.exports = {

    async check(client, guild) {
        if(client.servers.has(guild.id))
            return;
        await client.rethink.table('guilds').filter({id: guild.id}).run().then(async res => {
            if(res.length === 0) {
                await this._create(client, guild);
            } else {
                await this._cacheNoRequest(client, guild, res);
            }
        });
    },

    async _create(client, guild) {
        let newGuild = {
            id: guild.id,
            prefix: client.config.bot.prefixes.default,
            autorole: 'none'
        }
        await client.rethink.table('guilds').insert(newGuild).run();
        client.info('Database', `Inserted new guild: ${guild.id}`);
        this._cache(client, guild, newGuild);
    },

    async _cacheNoRequest(client, guild, res) {
        const newGuild = Object.assign(guild, res[0]);
        client.servers.set(guild.id, newGuild);
    },

    async _cache(client, guild) {
        await client.rethink.table('guilds').filter({id: guild.id}).run().then(async res => {
            const newGuild = Object.assign(guild, res[0]);
            client.servers.set(guild.id, newGuild);
        });
    },

    async delete(client, guildId) {
        await client.rethink.table('guilds').filter({id: guildId}).delete().run(res => {
            client.info('Database', `Deleted guild: ${guildId}`);
            client.servers.delete(guildId);
        });
    },

    async update(client, guild, options) {
        await client.rethink.table('guilds').filter({id: guild.id}).update(options).run().then(res => {
            this._cache(client, guild);
        });
    },

    async reload(client, guild) {
        this._cache(client, guild);
    },
}