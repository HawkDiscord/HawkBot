const { Player } = require('eris-lavalink');

class MusicManager {
    constructor(client, guild) {
        this.client = client;
        this.guild = guild;
    }

    async join(guild, channel) {
        let player = this.getPlayer(channel);
        console.log(player.channelId); //WENN UNDEFINED DANN getPlayer async machen und bei dem return in der letzten zeile ein await machen
        if(player.channelId !== channel.id)
            player.switchChannel(channel.id, true);
    }

    play(args) {

    }

    getPlayer(channel) {
        if(!channel || !channel.id) {
            throw new Error('Invalid channel');
        }

        let player = this.client.voiceConnections.get(channel.guild.id);
        if(player)
            return player;

        let options = {};
        if (channel.guild.region) {
            options.region = channel.guild.region;
        }

        return this.client.joinVoiceChannel(channel.id, options);
    }
}

module.exports = MusicManager;