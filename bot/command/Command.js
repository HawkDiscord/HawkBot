/**
 * Base class of every command.
 * @constructor
 * @param {eris} client - the eris instance that is used in the current shard
 * @param {string} options.name - the internal command name
 * @param {string} options.displayName - the public visible command name
 * @param {Array<string>} options.aliases - the command aliases
 * @param {string} options.description - the command description
 * @param {Array} options.usages - array with all usages of the command
 * @param {string} options.path string with __filename to the Command
 * @example
 * options.usages = [
 *    {
 *        usage: "set <prefix>",
 *        description: "Sets a new prefix."
 *    },
 *    {
 *        usage: ...,
 *        description: ...
 *    }
 *]
 * @param {boolean} options.botowner - whether the command should only be executable for botowners
 * @param {Array<Permission>} options.permissions - the command permissions
 * @param {int} options.cooldown - the command cooldown
 * @author ForYaSee
 */
class Command {
    constructor(client, options) {
        this.client = client;
        this.name = options.name || 'unknownCommand';
        this.displayName = options.displayName || this.name;
        this.aliases = options.aliases || [];
        this.description = options.description || 'No description provided';
        this.usages = options.usages || [{usage: '', description: this.description}];
        this.botowner = options.botowner || false;
        this.permissions = options.permissions || [client.permissions.NONE];
        this.cooldown = options.cooldown || 0;
        this.path = options.path ||__filename;
        this.type = 'command';
    }

    /**
     * The method will be called if command should be executed.
     * @param {message} message - the message that triggered the command
     * @param {array} args - the message splitted in string
     * @param {object} lang - a language object with the user's language
     * @author ForYaSee
     */
    async run(message, args, lang) {
        throw new Error(`[Command] ${this.name} doesn't provide a run Method.`);
    }

    async sendHelp(msg, lang) {
        let embed = {
            author: {
                name: `${this.displayName} Command - Help`,
                icon_url: this.client.user.avatarURL
            },
            color: 0x14bc05,
            description: this.description,
            fields: []
        };

        let usageVal = '';
        this.usages.forEach(usage => {
            usageVal += `\`${msg.guild.prefix}${this.name} ${usage.usage}\` - ${usage.description} \n`;
        });
        embed.fields.push({
            name: lang.help.command.usage,
            value: usageVal,
            inline: false
        });

        if (this.aliases.length > 0) {
            let aliasValue = '';
            this.aliases.forEach(alias => {
                aliasValue += '`' + alias + '` ';
            });
            embed.fields.push({
                name: lang.help.command.aliases,
                value: aliasValue,
                inline: false
            });
        }

        embed.fields.push({
            name: lang.help.command.permission,
            value: `\`${this.permissions}\``,
            inline: false
        });

        msg.channel.createMessage({
            embed: embed
        });
    }
}

module.exports = Command