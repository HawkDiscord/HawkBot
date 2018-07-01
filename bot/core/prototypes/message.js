module.exports = (client, message) => {
    message.sendSuccess = text => {
        return message.channel.createMessage(`${client.emotes.get('check')} ${message.author.mention}, ${text}`);
    }

    message.sendInfo = text => {
        return message.channel.createMessage(`${client.emotes.get('info')} ${message.author.mention}, ${text}`);
    }

    message.sendError = text => {
        return message.channel.createMessage(`${client.emotes.get('warning')} ${message.author.mention}, ${text}`);
    }
}