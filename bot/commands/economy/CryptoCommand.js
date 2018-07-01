const Command = require('../../command/Command');
const hawkUser = require('../../entities/HawkUser');
const superagent = require('superagent');
const roundTo = require('round-to');

class CryptoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'crypto',
            displayName: 'Crypto',
            description: 'Manage your cryptocurrencies. You can take a look [here](https://cryptocompare.com) to get an overview of all coins',
            usages: [
                {
                    usage: 'buy <abbr> <amount>',
                    description: 'Buy cryptocoins'
                },
                {
                    usage: 'sell <abbr> <amount>',
                    description: 'Sell your cryptocoins'
                },
                {
                    usage: 'view/lookup <abbr>',
                    description: 'Shows the price of cryptocoins'
                },
                {
                    usage: 'wallet',
                    description: 'Shows your wallet'
                },
                {
                    usage: 'wallet create',
                    description: 'Creates a new wallet for you'
                },
                {
                    usage: 'wallet delete',
                    description: 'Deletes your wallet'
                },
                {
                    usage: 'achievements',
                    description: '//TODO Shows all available achievements and their requirements'
                },
                {
                    usage: 'leaderboard',
                    description: '//TODO Your rank of the most successful trader'
                }
            ],
            path: __filename
        });
    }

    async run(msg, args, lang) {
        if(args.length === 0)
            return this.sendHelp(msg, lang);
        switch(args[0].toLowerCase()) {
            case 'buy':
                return this.buyCryptocoin(msg, args, lang);
            case 'sell':
                return this.sellCryptocoin(msg, args, lang);
            case 'view':
                return this.viewCryptocoin(msg, args, lang);
            case 'wallet':
                return this.manageWallet(msg, args, lang);
            case 'achievements':
                break;
            default:
                return this.sendHelp(msg, lang);
        }
    }

    async buyCryptocoin(msg, args, lang) {
        if (!msg.author.crypto.wallet) {
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.wallet.noWallet}`)
        }
        if(args.length !== 3)
            return this.sendHelp(msg, args, lang);
        let wallet = msg.author.crypto.wallet;
        let amount = parseFloat(args[2]);
        if(!amount)
            return this.sendHelp(msg, args, lang);
        let coinPrice = await this._getCryptocoinPrice(args[1]);
        if(!coinPrice)
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.view.notFound.replace('%crypto%', args[1])}`);
        let buyPrice = coinPrice * amount;
        if(buyPrice > wallet.money)
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.buy.noMoney.replace('%coinprice%', buyPrice).replace('%money%', roundTo(wallet.money, 2))}`)
        if(wallet.coins.some(c => c.name === args[1].toUpperCase())) {
            for(let i = 0; i < wallet.coins.length; i++) {
                let coin = wallet.coins[i];
                if(coin.name !== args[1].toUpperCase())
                    continue;
                wallet.coins[i].amount = wallet.coins[i].amount + amount;
            }
        } else {
            wallet.coins.push({
                name: args[1].toUpperCase(),
                amount: amount
            });
        }
        let crypto = msg.author.crypto;
        wallet.money = wallet.money - buyPrice;
        crypto.wallet = wallet;
        await hawkUser.update(this.client, msg.author, {crypto: crypto});
        msg.channel.createMessage(`${this.client.emotes.get('check')} ${msg.author.mention}, ${lang.crypto.buy.success.replace('%amount%', amount).replace('%coin%', args[1].toUpperCase())}`);
    }

    async sellCryptocoin(msg, args, lang) {
        if (!msg.author.crypto.wallet) {
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.wallet.noWallet}`)
        }
        if (args.length !== 3)
            return this.sendHelp(msg, args, lang);
        let wallet = msg.author.crypto.wallet;
        let amount = parseFloat(args[2]);
        if (!amount)
            return this.sendHelp(msg, args, lang);
        let coinPrice = await this._getCryptocoinPrice(args[1]);
        if (!coinPrice)
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.view.notFound.replace('%crypto%', args[1])}`);
        let sellPrice = coinPrice * amount;
        if (wallet.coins.some(c => c.name === args[1].toUpperCase())) {
            for (let i = 0; i < wallet.coins.length; i++) {
                let coin = wallet.coins[i];
                if (coin.name !== args[1].toUpperCase())
                    continue;
                let oldAmount = wallet.coins[i].amount;
                if(oldAmount - amount < 0) {
                    return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.sell.notEnough.replace('%amount%', oldAmount).replace('%coin%', args[1].toUpperCase())}`);
                }
                if(oldAmount - amount === 0)
                    wallet.coins[i] = null;
                else
                    wallet.coins[i].amount = oldAmount - amount;
            }
        } else
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.sell.noCoin}`);
        let crypto = msg.author.crypto;
        wallet.money = wallet.money + sellPrice;
        crypto.wallet = wallet;
        await hawkUser.update(this.client, msg.author, {
            crypto: crypto
        });
        msg.channel.createMessage(`${this.client.emotes.get('check')} ${msg.author.mention}, ${lang.crypto.sell.success.replace('%amount%', amount).replace('%coin%', args[1].toUpperCase())}`);
    }

    async viewCryptocoin(msg, args, lang) {
        if(args.length !== 2)
            return this.sendHelp(msg, lang);
        let price = await this._getCryptocoinPrice(args[1]);
        if (!price)
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.view.notFound.replace('%crypto%', args[1])}`);
        else
            return msg.channel.createMessage(`:dollar: ${args[1].toUpperCase()} ${msg.author.mention}, ${lang.crypto.view.worth.replace('%price%', price)}`);
    }

    async manageWallet(msg, args, lang) {
        if(args.length === 1)
            return this.showWallet(msg, args, lang);
        switch(args[1].toLowerCase()) {
            case 'create':
                return this.createWallet(msg, args, lang);
            case 'delete':
                return this.deleteWallet(msg, args, lang);
            default:
                return this.sendHelp(msg, args);
        }
    }

    async showWallet(msg, args, lang) {
        if(!msg.author.crypto.wallet) {
            return msg.channel.createMessage(`${this.client.emotes.get('warning')} ${msg.author.mention}, ${lang.crypto.wallet.noWallet}`)
        }
        let coinString = '';
        for(let coin of msg.author.crypto.wallet.coins) {
            if(!coin)
                continue;
            coinString += `:small_blue_diamond: ${coin.amount}x${coin.name}\n`;
        }
        if(coinString === '')
            coinString = lang.crypto.wallet.noCoins;
        let embed = {
            author: {
                name: `${msg.author.username} - Wallet`,
                icon_url: msg.author.avatarURL
            },
            fields: [
                {
                    name: 'Coins',
                    value: coinString,
                    inline: true
                },
                {
                    name: lang.crypto.wallet.money,
                    value: `:dollar: ${roundTo(msg.author.crypto.wallet.money, 2)}$`,
                    inline: true
                }
            ],
            color: 0xE5C100,
            footer: {
                text: `Requested by ${msg.author.mention}`,
                icon_url: msg.author.avatarURL
            }
        }
        msg.channel.createEmbed(embed);
    }

    async createWallet(msg, args, lang) {
        let crypto = msg.author.crypto;
        crypto.wallet = {
            money: 25,
            coins: [],
            createdAt: Date.now()
        }
        await hawkUser.update(this.client, msg.author, {crypto: crypto});
        return msg.channel.createMessage(`${this.client.emotes.get('check')} ${msg.author.mention}, ${lang.crypto.wallet.created}`);
    }

    async deleteWallet(msg, args, lang) {
        let crypto = msg.author.crypto;
        crypto.wallet = null;
        await hawkUser.update(this.client, msg.author, {crypto: crypto});
        return msg.channel.createMessage(`${this.client.emotes.get('check')} ${msg.author.mention}, ${lang.crypto.wallet.deleted}`);
    }

    async _getCryptocoinPrice(abbrevation) {
        let res = await superagent.get(`https://min-api.cryptocompare.com/data/price?fsym=${abbrevation.toUpperCase()}&tsyms=USD`).send();
        if (res.body.Response && res.body.Response === 'Error')
            return null;
        else return res.body.USD;
    }
}

module.exports = CryptoCommand;