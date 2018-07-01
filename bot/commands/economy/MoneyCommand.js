const Command = require('../../command/Command');

class MoneyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'money',
            displayName: 'Money',
            description: 'Shows your money',
            path: __filename
        });
    }

    async run(msg, args, lang) {
        let money = msg.author.money;
        msg.sendInfo(lang.money.replace('%money%', money));
    }
}

module.exports = MoneyCommand;