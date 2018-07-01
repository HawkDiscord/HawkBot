module.exports = {

    async check(client, user) {
        if (client.members.has(user.id))
            return;
        await client.rethink.table('users').filter({
            id: user.id
        }).run().then(async res => {
            if (res.length === 0) {
                await this._create(client, user);
            } else {
                await this._cacheNoRequest(client, user, res);
            }
        });
    },

    async _create(client, user) {
        let newUser = {
            id: user.id,
            money: 0,
            bio: 'No bio set.',
            premium: 0,
            language: 'en_US',
            crypto: {}
        };
        await client.rethink.table('users').insert(newUser).run();
        client.info('Database', `Inserted new user: ${user.id}`);
        this._cache(client, user, newUser);
    },

    async _cacheNoRequest(client, user, res) {
        const newUser = Object.assign(user, res[0]);
        client.members.set(user.id, newUser);
    },

    async _cache(client, user) {
        await client.rethink.table('users').filter({
            id: user.id
        }).run().then(async res => {
            const newUser = Object.assign(user, res[0]);
            client.members.set(user.id, newUser);
        });
    },

    async delete(client, userId) {
        await client.require.table('users').filter({
            id: userId
        }).delete().run(res => {
            client.info('Database', `Deleted user: ${userId}`);
            client.members.delete(userId);
        });
    },

    async update(client, user, options) {
        await client.rethink.table('users').filter({
            id: user.id
        }).update(options).run().then(res => {
            this._cache(client, user);
        });
    }
}