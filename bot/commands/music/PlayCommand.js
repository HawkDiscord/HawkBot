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
        this.client.functions.checkGuildMusicManager(this.client, msg.guild, msg.member);
        if(msg.member.voiceState.channelID == null)
            return msg.channel.createMessage('Error! You have to be inside a voicechannel!');
        this.client.players.get(msg.guild.id).join(this.client.getChannel(msg.member.voiceState.channelID));
    }
}

module.exports = PlayCommand;