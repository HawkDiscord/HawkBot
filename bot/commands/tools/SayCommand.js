const Command = require('../../command/Command');

class SayCommand extends Command {
    constructor(client) {
        super(client,{
            name: 'say',
            displayName: 'Say',
            description: 'Send messages to channels with Hawk',
            path: __filename
        })
    }

    async run(message, args, lang) {
        if(args.length == 0)
            return message.channel.createMessage(lang.say.usage).then(message => {
                setTimeout(() => {
                    message.delete();
                }, 1500);
            });
        let channelId;
        if(message.channelMentions.length == 0)
            channelId = message.channel.id;
        else
            channelId = message.channelMentions[0];

        let channel = message.guild.channels.find(channel => channel.id === channelId);

        let messageText = "";
        for(let i = message.channelMentions.length == 0 ? 0 : 1; i < args.length; i++){
            messageText += args[i] + " ";
        }
    
        if(messageText.includes('-description')){
            let options = splitOptions('-', messageText);
            let embed = {
                author: {
                    name: message.author.name,
                    icon_url: message.author.avatarURL
                },
                fields: []
            };
            if(options.has('footer')){
                embed.footer = {
                    text: options.get('footer')
                }
            }
            if(options.has('color')){
                let color = options.get('color');
                if(isNaN(color))
                    return message.channel.sendMessage(lang.say.invalidColorCode)
                embed.color = parseInt('0x' + color);
            }
            if(options.has('description')){
                embed.description = options.get('description');
            }
            if(options.has('title')){
                embed.title = options.get('title');
            }
            
            channel.createMessage({
                embed: embed
            });
        } else
            channel.createMessage(messageText);

    }
}

function splitOptions(seperator, rawString){
    let args = rawString.split(seperator);
    let out = new Map();
    args.forEach(element => {
        let splittedElement = element.split(" ");
        out.set(splittedElement[0], element.replace(splittedElement[0] + ' ', ''));
    });
    return out;
}


module.exports = SayCommand;