const Command = require('../../command/Command');

class PlayCommand extends Command {
    constructor(client) {
        super(client,{
            name: 'play',
            displayName: 'Play',
            description: 'Plays a specific song',
            path: __filename
        })
    }

    async run(msg, args, lang) {
        await this.client.functions.checkGuildMusicManager(this.client, msg.guild);
        if(msg.member.voiceState.channelID == null)
            return msg.channel.createMessage('Error! You have to be inside a voicechannel!');
        await this.client.players.get(msg.guild.id).join(msg.guild, this.client.getChannel(msg.member.voiceState.channelID));
    }
}

module.exports = PlayCommand;