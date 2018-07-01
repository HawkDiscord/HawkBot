module.exports = (client, message) => {

    message.sendCustom = (emote, text) => {
        return `${emote} ${message.author.mention}, ${text}`;
    }

    message.sendSuccess = text => {
        return `${client.emotes.get('check')} ${message.author.mention}, ${text}`;
    }

    message.sendInfo = text => {
        return `${client.emotes.get('info')} ${message.author.mention}, ${text}`;
    }

    message.sendError = text => {
        return `${client.emotes.get('warning')} ${message.author.mention}, ${text}`;
    }
}