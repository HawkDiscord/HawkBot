/**
 * Base class of every command.
 * @constructor
 * @param {eris} client - the eris instance that is used in the current shard
 * @param {string} options.name - the internal command name
 * @param {string} options.displayName - the public visible command name
 * @param {array} options.aliases - the command aliases
 * @param {string} options.description - the command description
 * @param {array} options.usages - array with all usages of the command
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
 * @param {object} options.permissions - the command permissions
 * @example
 * options.permissions = {
 *     botowner: false,
 *     default: true
 * }
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
        this.permissions = options.permissions || {botowner: false, default: true};
        this.cooldown = options.cooldown || 0;

        this.path = __filename;
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
}

module.exports = Command