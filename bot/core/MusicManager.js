class MusicManager {
    constructor(client, guild) {
        this.client = client;
        this.guild = guild;
    }

    join(channel) {
        let options = {};
        if (channel.guild.region) {
            options.region = channel.guild.region;
        }

        return this.client.voiceConnections.join(this.guild.id, channel.id, options);
    }

    play(args) {

    }
}

module.exports = MusicManager;